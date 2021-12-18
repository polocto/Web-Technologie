const db = require('../db/db');
const express = require('express');
const messages = require('./messages');
const StatusError = require('../error');
const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const user = await db.users.get(req.body.id);
        const channels = await db.channels.list(user.channels);
        channels.map(channel => {
          delete channel.users;
          delete channel.admin;
          delete channel.shareFile;
          delete channel.shareImage;
          delete channel.shareLinks;
          delete channel.pinned;
          return channel;
        })
        res.status(200).send(channels);
    }
    catch(err){
        if (err instanceof StatusError)
        {
            res.status(err.status).send(err.message);
        }
        else
        {
            console.error(err);
            res.status(520).send(err.message);
        }
    }
});

router.post('/', async (req, res) => {
    try{
        const [metadata, user] = req.body;
        if(metadata.users.length <2)
        {
            throw new StatusError (403,"You should select more users");
        }
        else
        {
            const channel = await db.channels.create(metadata,user.id);
            const newUser = await db.users.get(user.id);
            if(!channel.users.some(elem => elem.id.match(newUser.id))) throw new StatusError(409,"User haven't be add well to the channel");
            if(!newUser.channels.some(elem => elem.match(channel.id))) throw new StatusError(409,"Channel haven't be add well to the user");
            res.status(201).send(newUser);
        }
    }
    catch(err){
        if (err instanceof StatusError)
        {
            res.status(err.status).send(err.message);
        }
        else
        {
            console.error(err);
            res.status(520).send(err.message);
        }
    }
});

router.get('/:id', async (req, res) => {
    try{
        const user = await db.users.get(req.body.id);
        if(!user.channels.some(elem => elem.match(req.params.id)))
        {
            throw new StatusError(404,"This user have no right to access this channel");
        }
        const channel = await db.channels.get(req.params.id);
        channel.users = await db.users.list(channel.users.map(user => {
            
            if(user.presentTime.length<1) throw new Error("list channel -> user.presentTime.length < 1");
            const presentTime = user.presentTime[user.presentTime.length - 1]
            const keys = Object.keys(presentTime);
            if(!keys.some(elem => elem.match(/departureTime/)))
              return user.id;
            else
                return null;
    
        }).filter(user => user!=null));


        channel.admin = channel.admin.some(elem => elem.match(req.body.id));

        res.status(200).send(channel);
    }
    catch(err){
        if (err instanceof StatusError)
        {
            res.status(err.status).send(err.message);
        }
        else
        {
            console.error(err);
            res.status(520).send(err.message);
        }
    }
});

router.put('/:id', async (req, res) => {
    try{
        let [metadata, user] = req.body;
        user = await db.users.get(user.id);
        if(!user.channels.some(elem=>elem.match(req.params.id))) throw new StatusError(401,"You don't have the authorization to access to this channel");
        const channel = await db.channels.get(req.params.id);
        
        const keys = Object.keys(metadata);

        keys.map(key =>{
            if(!key.match(/share/) && !key.match(/admin/) && Object.keys(channel).some(k => k.match(key)))
            {
                if(!key.match(/users/) || channel.admin.some(id => id.match(user.id)))
                    channel[key] = metadata[key];
                else
                    throw new StatusError(402, "You can't modify the users of the channel");
            }
        });
        
        res.status(200).send(channel);
    }
    catch(err){
        if (err instanceof StatusError)
        {
            res.status(err.status).send(err.message);
        }
        else
        {
            console.error(err);
            res.status(520).send(err.message);
        }
    }
});

router.delete('/:id', async (req, res) => {
    try{
        const user = await db.users.get(req.body.id);

        const channel = await db.channels.get(req.params.id);
        channel.users = await db.users.list(channel.users.map(user => {
            
            if(user.presentTime.length<1) throw new Error("list channel -> user.presentTime.length < 1");
            const presentTime = user.presentTime[user.presentTime.length - 1]
            const keys = Object.keys(presentTime);
            if(!keys.some(elem => elem.match(/departureTime/)))
              return user.id;
            else
                return null;
    
        }).filter(user => user!=null));
        if(!channel.users.some(u => u.id.match(user.id))) throw new StatusError(409, "User is not in the channel");

        channel.users.splice(channel.users.findIndex(item => item.id.match(user.id)),1);
        const index = channel.admin.findIndex(item => item.match(user.id));
        if(index>=0)channel.admin.splice(index,1);
        user.channels.splice(user.channels.indexOf(channel.id),1);

        if(!channel.admin.length && channel.users.length)
            channel.admin.push(channel.users.at(0).id);

        await db.channels.update(channel)
        .then(async (value) => {
            if(!value.admin.length) db.channels.delete(value);
        })
        res.status(200).send(user);
    }
    catch(err){
        if (err instanceof StatusError)
        {
            res.status(err.status).send(err.message);
        }
        else
        {
            console.error(err);
            res.status(520).send(err.message);
        }
    }
});

router.use('/:id*', messages);

module.exports = router;