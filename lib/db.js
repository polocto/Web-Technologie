
const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

const store =  {
  channels: {
  }
}
// const level = require('level')
// const db = level(__dirname + '/../db')

module.exports = {
  users: {
    create: async (user) => {
      if(!user.username) throw Error('Invalid user')
      const id = uuid()
      store.users[id] = user
      return merge(user, {id: id})
    },
    list: async () => {
      return Object.keys(store.users).map( (id) => {
        const user = clone(store.users[id])
        user.id = id
        return user
      })
    }
  },
  channels: {
    create: async (channel) => {
      if(!channel.name) throw Error('Invalid channel')
      const id = uuid()
      store.channels[id] = channel
      // await db.put(`channels:${id}`, JSON.stringify(channel))
      return merge(channel, {id: id})
    },
    list: async () => {
      return Object.keys(store.channels).map( (id) => {
        const channel = clone(store.channels[id])
        channel.id = id
        return channel
      })
      // return new Promise( (resolve, reject) => {
      //   const channels = []
      //   db.createReadStream({
      //     gt: "channels:",
      //     lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
      //   }).on( 'data', ({key, value}) => {
      //     channel = JSON.parse(value)
      //     channel.id = key.split(':')[1]
      //     channels.push(channel)
      //   }).on( 'error', (err) => {
      //     reject(err)
      //   }).on( 'end', () => {
      //     resolve(channels)
      //   })
      // })
    },
    update: (id, channel) => {
      const original = store.channels[id]
      if(!original) throw Error('Unregistered channel id')
      store.channels[id] = merge(original, channel)
    },
    delete: (id, channel) => {
      const original = store.channels[id]
      if(!original) throw Error('Unregistered channel id')
      delete store.channels[id]
    }
  },
  messages:{
    create: async(message) => {
      if(!message.content) throw Error("Unregistered message content")
      creation = Date.now()
      store.messages[creation] = message
      return merge(message, {creation: creation})
    },
    list: async() => {
      return Object.keys(store.messages).map((id)=>{
        const message = clone(store.messages[id])
        message.creation = creation
        return message
      })
    }
  },
  admin: {
    clear: async () => {
      store.channels = {}
      store.users = {}
      store.messages = {}
      // await db.clear()
    }
  }
}
