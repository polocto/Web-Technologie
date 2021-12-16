const db = require('./db');
const express = require('express');
const messages = require('./messages');
const router = express.Router();

router.get('/', async (req, res) => {
    const channels = await db.channels.list();
    res.json(channels);
});

router.post('/', async (req, res) => {
    const channel = await db.channels.create(req.body);
    res.status(201).json(channel);
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

// router.get('/:id/messages', async (req, res) => {
//     try{
//         const channel = await db.channels.get(req.params.id);
//     }catch(err){
//         return res.status(404).send('Channel does not exist.');
//     }
//     const messages = await db.messages.list(req.params.id);
//     res.json(messages);
// })

// router.post('/:id/messages', async (req, res) => {
//     const message = await db.messages.create(req.params.id, req.body);
//     res.status(201).json(message);
// })

module.exports = router;