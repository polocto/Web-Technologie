const {v4: uuid} = require('uuid');
const { merge} = require('mixme');
const microtime = require('microtime');
const db = require('./leveldb');
const StatusError = require('../error');

const users = require('./users');

module.exports = {
    create: async (channel,idUser) => {
      if(!channel.name) throw StatusError(400,'Invalid channel');   
      const id = uuid();
      const presentTime= [{
        arrivalTime: microtime.now()
      }];

      channel.users = Promise.all(channel.users.map(async (idU) => {
        const user = await users.get(idU);
        user.channels.push(id);
        delete user.id;
        await db.put(`users:${idU}`, JSON.stringify(user));
        return merge({id: idU}, {presentTime: {...presentTime}})
      },this));

      channel = merge(channel,{admin: [idUser] })
      await db.put(`channels:${id}`, JSON.stringify(channel));
      return await this.users.get(idUser);
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
}