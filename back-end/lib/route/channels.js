const db = require('../db/db');
const express = require('express');
const messages = require('./messages');
const router = express.Router();

router.get('/', async (req, res) => {
    const channels = await db.channels.list();
    res.json(channels);
});

router.post('/', async (req, res) => {
    try{
        const [metadata, userId] = req.body;
        const channel = await db.channels.create(metadata,userId);
        res.status(201).json(channel);
    }
    catch(err){
        res.status(err.status).send(err.messages);
    }
});

router.get('/:id', async (req, res) => {
    const channel = await db.channels.get(req.params.id);
    res.json(channel);
});

router.put('/:id', async (req, res) => {
    const channel = await db.channels.update(req.body);
    res.json(channel);
});

router.use('/:id*', messages);

module.exports = router;