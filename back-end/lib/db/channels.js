const {v4: uuid} = require('uuid');
const { merge} = require('mixme');
const microtime = require('microtime');
const db = require('./leveldb');
const StatusError = require('../error');

const users = require('./users');

module.exports = {
    create: async (metadata,idUser) => {
      if(!metadata.name) throw StatusError(400,'Invalid channel');   
      const id = uuid();
      const presentTime= [{
        arrivalTime: microtime.now()
      }];

      let channel = {...metadata};
      
      if(!channel.users.some(elem => elem.match(idUser))) channel.users.push(idUser);
      
      channel.users = await Promise.all(channel.users.map(async (idU) => {
        let user = await users.get(idU);
        user.channels.push(id);
        delete user.id;
        await db.put(`users:${idU}`, JSON.stringify(user));
        return merge({id: idU}, {presentTime: [...presentTime]})
      }));

      channel = merge(channel,
      {
        admin: [idUser],
        pinned: [],
        shareFile: [],
        shareImage: [],
        shareLinks: [] 
      })
      await db.put(`channels:${id}`, JSON.stringify(channel));
      return merge({id: id}, channel);
    },

    get: async (id) => {
      if(!id) throw StatusError(400,'Invalid id');
      try
      {
        const data = await db.get(`channels:${id}`);
        const channel = JSON.parse(data);
        return merge({id: id}, channel);
      }
      catch(err)
      {
        throw new StatusError(404, `Channel's ${id} doesn't exist`);
      }
    },

    list: async function (channels) {
      if(!channels)
      {
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
      }
      else
      {
        return await Promise.all(channels.map(async (id) =>{
          let channel = await this.get(id);
          return channel;
        },this));
      }
    },

    update: async function (channel){
      const original = await this.get(channel.id);
      const originalKeys = Object.keys(original);
      const channelKeys = Object.keys(channel);
      const time = microtime.now();

      if(originalKeys.length != channelKeys.length) throw new StatusError(403, `wrong number keys`);
      //update access to channel for all existing users
      await original.users.map( async user => {
        const userToModify = await users.get(user.id);
        if(channel.users.some(u => u.id.match(user.id)))
        {
          const keys = Object.keys(user.presentTime[user.presentTime.length-1]);
          if(keys.some(elem => elem.match(/departureTime/)))
          {
            user.presentTime.push({arrivalTime: time});
            userToModify.channels.push(channel.id);
          }
        }
        else
        {
          const keys = Object.keys(user.presentTime[user.presentTime.length-1]);
          if(!keys.some(elem => elem.match(/departureTime/)))
          {
            user.presentTime[user.presentTime.length-1].departureTime = time;
            userToModify.channels.splice(userToModify.channels.indexOf(channel.id),1);
          }
        }
        const result = await users.update(userToModify);
        if(!result.id.match(user.id)) throw new StatusError(409,"Unknow Error return id does not match");
      });

      channel.users.map( u => {
        if(!original.users.some(user => user.id.match(u.id)))
        {
          original.users.push({
            id: u.id,
            presentTime: [{arrivalTime: time}]
          });
        }
      });

      delete original.id;
      await db.put(`channels:${channel.id}`, JSON.stringify(original));
      return channel;
    },

    delete: async function (channel, admin) {
      if(channel.admin.length != 0 && admin && !channel.admin.some(id => id.match(admin))) throw new StatusError(403,)
      //delete channel from all users
      channel.users.map(async userId => {
        const user = await users.get(userId);
        user.channels.splice(user.channels.indexOf(channel.id),1);
        await users.update(user);
      });
      channel = await this.update(channel);
      db.del(`channels:${channel.id}`);
      db.clear({
        gt: `messages:${channelId}:`,
        lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
      });
    }
}