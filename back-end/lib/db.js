
const {v4: uuid} = require('uuid');
const {clone, merge} = require('mixme');
const microtime = require('microtime');
const level = require('level');
const db = level(__dirname + '/../db');
const StatusError = require('./error');

module.exports = {
  channels: {
    create: async (channel) => {
      if(!channel.name) throw StatusError(400,'Invalid channel');   
      const id = uuid();
      const presentTime= [{
        arrivalTime: microtime.now()
      }];
      channel.users = channel.users.map((user) => merge(user, {presentTime: presentTime}));
      await db.put(`channels:${id}`, JSON.stringify(channel));
      return merge({id: id}, channel);
    },

    get: async (id) => {
      if(!id) throw StatusError(400,'Invalid id');
      const data = await db.get(`channels:${id}`);
      const channel = JSON.parse(data);
      return merge({id: id}, channel);
    },

    list: async () => {
      return new Promise( (resolve, reject) => {
        const channels = [];
        db.createReadStream({
          gt: "channels:",
          lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          channel = JSON.parse(value);
          channel.id = key.split(':')[1];
          channels.push(channel);
        }).on( 'error', (err) => {
          reject(err);
        }).on( 'end', () => {
          resolve(channels);
        });
      });
    },

    update: (id, channel) => {
      const original = store.channels[id];
      if(!original) throw StatusError(404,'Unregistered channel id');
      store.channels[id] = merge(original, channel);
    },

    delete: (id, channel) => {
      const original = store.channels[id];
      if(!original) throw StatusError(404,'Unregistered channel id');
      delete store.channels[id];
    }
  },

  messages: {
    create: async (channelId, message) => {
      if(!channelId) throw StatusError(400,'Invalid channel');
      if(!message.author) throw StatusError(400,'Invalid message');
      if(!message.content) throw StatusError(400,'Invalid message');
      creation = microtime.now();
      await db.put(`messages:${channelId}:${creation}`, JSON.stringify({
        author: message.author,
        content: message.content
      }));
      return merge(message, {channelId: channelId, creation: creation});
    },

    list: async (channelId) => {
      return new Promise( (resolve, reject) => {
        const messages = [];
        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          message = JSON.parse(value);
          const [, channelId, creation] = key.split(':');
          message.channelId = channelId;
          message.creation = creation;
          messages.push(message);
        }).on( 'error', (err) => {
          reject(err);
        }).on( 'end', () => {
          resolve(messages);
        });
      });
    },
  },

  users: {
    get: async (id) => {
      try
      {
        if(!id) throw StatusError(400, 'Invalid id');
        if(!id.match(/^\w+-\w+-\w+-\w+-\w+$/))
        {
          id = await db.get(`email:${id}`);
        }
        const data = await db.get(`users:${id}`);
        const user = JSON.parse(data);
        return merge(user, {id: id});
      }
      catch
      { 
        throw new StatusError(404, "User not found");
      }
    },

    create: async function (user) {
      if(!user.email) throw new StatusError(400, 'Invalid user');
      try{
        await this.get(user.email);
      }
      catch(err)
      {
        const id = uuid();
        user = merge(user, { onLineStatus: "available", pendingInvitation: [], sentInvitation: [], channels: [], contacts: [], importantMessages: [] });
        await db.put(`users:${id}`, JSON.stringify(user));
        await db.put(`email:${user.email}`, id);
        
        return merge(user, {id: id});
      }
      throw new StatusError(409,`${user.email} already exists`);
    },

    list: function (users) {
      if(!users)
      {
        return new Promise( (resolve, reject) => {
          const users = [];
          db.createReadStream({
            gt: "users:",
            lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
          }).on( 'data', ({key, value}) => {
            user = JSON.parse(value);
            user.id = key.split(':')[1];
            delete user.sentInvitation;
            delete user.pendingInvitation;
            delete user.contact;
            delete user.channels;
            delete user.importantMessages;
            users.push(user);
          }).on( 'error', (err) => {
            reject(err);
          }).on( 'end', () => {
            resolve(users);
          })
        })
      }
      else
      {
        return Promise.all(users.map(async function (id) {
          let user = await this.get(id);
          delete user.pendingInvitation;
          delete user.sentInvitation;
          delete user.channels;
          delete user.contacts;
          delete user.importantMessages;
          return user;
        }, this));
      }
    },

    deleteContact: async function(idUser,idContact){
      const user = await this.get(idUser);
      const contact = await this.get(idContact);

      const match = element => element.match(idContact);

      if(user.pendingInvitation.some(match))
      {
        contact.sentInvitation.splice(contact.sentInvitation.indexOf(idUser),1);
        user.pendingInvitation.splice(user.pendingInvitation.indexOf(idContact),1);
      }
      else if(user.sentInvitation.some(match))
      {
        user.sentInvitation.splice(user.sentInvitation.indexOf(idContact),1);
        contact.pendingInvitation.splice(contact.pendingInvitation.indexOf(idUser),1);
      }
      else if(user.contacts.some(match))
      {
        contact.contacts.splice(contact.contacts.indexOf(idUser),1);
        user.contacts.splice(user.contacts.indexOf(idContact),1);
      }
      else
      {
        throw new StatusError(404,"This user is in any list");
      }

      delete user.id;
      delete contact.id;

      await db.put(`users:${idUser}`, JSON.stringify(user));
      await db.put(`users:${idContact}`, JSON.stringify(contact));
      return merge({id: idUser},user);
    },

    update: async function (id, user) {
      const original = await this.get(id);
      const keys = Object.keys(user);

      keys.map(key => {
        if(!key.match("id") && !key.match("email"))
        {
          original[key] = user[key];
        }
        else
        {
          throw new StatusError(403,`You are not authorised to modify or add the parameter ${key}`);
        }
      });
      delete original.id;
      await db.put(`users:${id}`, JSON.stringify(original));
      return merge({id: id}, original);
    },

    sendInvitation: async function (senderId,email) {
      const user = await this.get(senderId);
      const receiver = await this.get(email);
      const receiverId = receiver.id;

      user.sentInvitation.push(receiverId);
      receiver.pendingInvitation.push(senderId);

      delete receiver.id;
      delete user.id;

      await db.put(`users:${receiverId}`, JSON.stringify(receiver));
      await db.put(`users:${senderId}`, JSON.stringify(user));
      return merge(user, {id: senderId});
    },

    acceptInvitation: async function (receiverId, senderId) {
      const sender = await this.get(senderId);
      const user = await this.get(receiverId);
     
      const indexReceiver = sender.sentInvitation.indexOf(receiverId);
      sender.sentInvitation.splice(indexReceiver,1);
      user.pendingInvitation.splice(user.pendingInvitation.indexOf(senderId),1);

      sender.contacts.push(receiverId);
      user.contacts.push(senderId);

      await db.put(`users:${receiverId}`, JSON.stringify(user));
      await db.put(`users:${senderId}`, JSON.stringify(sender));

      return merge(user, {id: receiverId});
    },

    delete: (id, user) => {
      const original = store.users[id];
      if(!original) throw Error('Unregistered user id');
      delete store.users[id];
    }
  },

  admin: {
    clear: async () => {
      try
      {
        await db.clear();
      }
      catch{

      }
    }
  }
}
