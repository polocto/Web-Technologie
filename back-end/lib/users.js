const db = require('./db');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await db.users.list();
    res.json(users);
})
  
router.post('/', async (req, res) => {
    const user = await db.users.create(req.body);
    res.status(201).json(user);
})

router.get('/:id', async (req, res) => {
    const user = await db.users.get(req.params.id);
    res.json(user);
})

router.put('/:id', async (req, res) => {
    const user = await db.users.update(req.body);
    res.json(user);
})

module.exports = router;