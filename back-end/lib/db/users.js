const {v4: uuid} = require('uuid');
const {merge} = require('mixme');
const db = require('./leveldb');
const StatusError = require('../error');

module.exports ={
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
            const user = JSON.parse(value);
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

    update: async function (user) {
        let original = await this.get(user.id);

        if(!original.email.match(user.email)) throw new StatusError(403,"Properties not modifiable");

        const id =  original.id;
        const keys = Object.keys(user);

        keys.map(key=>{
            original[key] = user[key];
        })

        delete original.id;
        await db.put(`users:${id}`, JSON.stringify(original));
        user = await this.get(id);
        return user;
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

        delete user.id;
        delete sender.id;

        await db.put(`users:${receiverId}`, JSON.stringify(user));
        await db.put(`users:${senderId}`, JSON.stringify(sender));

        return merge(user, {id: receiverId});
    },

    delete: (id, user) => {
        const original = store.users[id];
        if(!original) throw Error('Unregistered user id');
        delete store.users[id];
    }
}