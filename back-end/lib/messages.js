const db = require('./db');
const express = require('express');
const router = express.Router({ mergeParams : true });

router.get('/', async (req, res) => {
    try{
        const channel = await db.channels.get(req.params.id);
    }catch(err){
        return res.status(404).send('Channel does not exist.');
    }
    const messages = await db.messages.list(req.params.id);
    res.json(messages);
})

router.post('/', async (req, res) => {
    const message = await db.messages.create(req.params.id, req.body);
    res.status(201).json(message);
})

module.exports = router;