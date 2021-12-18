const db = require('../db/db');
const express = require('express');
const router = express.Router({ mergeParams : true });
const StatusError = require('../error');

router.get('/', async (req, res) => {
    try{
        const user = req.body;
        const channel = await db.channels.get(req.params.id);

        const presentTime = [...channel.users.at(channel.users.findIndex(elem => elem.id.match(user.id))).presentTime];
        
        const messages = await Promise.all(presentTime.map(interval => {
            return db.messages.list(channel.id,interval);
        }));        
       
       res.status(200).send(messages.flat());
        
    }catch(err){
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
})

router.post('/', async (req, res) => {
    try{
        const [user,content] = req.body;
        const message = await db.messages.create(req.params.id, {author: user.id, content: content});
        res.status(201).send(message);
    }catch(err){
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
})

router.get('/:creation', async (req, res) => {
    try{
        const user = req.body;
        const channel = await db.channels.get(req.params.id);

        if(!channel.users[channel.users.findIndex(elem=>elem.id.match(user.id))].presentTime.some((elem)=>{
            const keys = Object.keys(elem);
            if(elem.arrivalTime > creation || (keys.length>=2 && elem.departureTime < creation)) return false;
            return true;
        }))throw new StatusError(404,"No messages found")

        const message = await db.messages.get(req.params.id, req.params.creation, user.id);
        res.status(200).send(message);
    }catch(err){
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
})

router.delete('/:creation', async (req, res) => {
    try{
        const user = req.body;
        const message = await db.messages.get(req.params.id,req.params.creation);
        if(!message.author.match(user.id)) throw new StatusError(404, "The user is not the creator of the message")
        db.messages.delete(req.params.id, req.params.creation)
        .then(()=>{
            res.sendStatus(200);
        });
    }catch(err){
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
})

module.exports = router;