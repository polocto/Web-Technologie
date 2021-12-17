const db = require('./leveldb');

module.exports =  {
    clear: async () => {
        await db.clear();
    }
}