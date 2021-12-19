const {merge} = require('mixme');
const microtime = require('microtime');
const db = require('./leveldb');
const StatusError = require('../error');

module.exports = {
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

    list: function (channelId,accessTime) {
      return new Promise( (resolve, reject) => {
        const messages = [];
        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          const [, channelId, creation] = key.split(':');
          const keys= Object.keys(accessTime);
          if(creation>=accessTime.arrivalTime && (keys.length==1 || creation<=accessTime.departureTime))
          {
            let message = JSON.parse(value);
            message.channelId = channelId;
            message.creation = creation;
            messages.push(message);
          }
        }).on( 'error', (err) => {
          reject(err);
        }).on( 'end', () => {
          resolve(messages);
        });
      });
    },

    get: async function (channel, creation){
      try{
        const data = await db.get(`messages:${channel}:${creation}`);
        const message = JSON.parse(data);
        return merge(message, {channelId: channel, creation: creation})
      }catch(err)
      {
        throw new StatusError(404, "Message Not Found");
      }
    },
    getLast: async function (channelId){
      return await new Promise( (resolve, reject) => {
        db.createKeyStream({
          gt: `messages:${channelId}:`,
          lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
          reverse: true,
          limit: 1
        }).on( 'data', (key) => {
          const [, , creation] = key.split(':');
          resolve(creation);
        })
        .on('end',()=>{
          resolve(null);
        });
      });
    },
    update: async function (channel, creation, content){
      let message = await this.get(channel,creation);
      message.modification = microtime.now();
      message.content = content;
      await db.put(`messages:${channel}:${creation}`, JSON.stringify({
        author: message.author,
        content: message.content,
        modification: message.modification
      }));

      return message;
    },
    delete: async function (channel, creation){
      try{
        return await db.del(`messages:${channel}:${creation}`);
      }catch(err)
      {
        throw new StatusError(404, "Message Not Found");
      }
    }
}