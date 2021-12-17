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
}