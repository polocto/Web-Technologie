const db = require('../db/db');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await db.users.list();
    res.status(200).json(users);
});
  
router.post('/', async (req, res) => {
    try {
        const user = await db.users.create(req.body)
        res.status(201).json(user);
    }
    catch(err ){
        res.status(err.status).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    try{
        const user = await db.users.get(req.params.id);
        res.status(200).json(user);
    }
    catch(err){
        res.status(err.status).send(err.message);
    }
});

router.put('/:id', async (req, res) => {
    try{
        const user = await db.users.update(req.params.id, req.body);
        res.status(200).json(user);
    }
    catch(err){
        res.status(err.status).send(err.message);
    }
});

router.get('/:id/contacts', async (req, res) => {
    try{
        const users = await db.users.list(req.body);
        res.status(200).json(users);
    }
    catch(err){
        res.status(err.status).send(err.message);
    }
});

router.post('/:id/contacts', async (req, res) => {
    try{
        const user = await db.users.sendInvitation(req.params.id,req.body.email);
        res.status(200).json(user);
    }
    catch(err){
        res.status(err.status).send(err.message);
    }
});

router.post('/:id/contacts/:contactId', async (req, res) => {
    try{
        const user = await db.users.acceptInvitation(req.params.id,req.params.contactId);
        res.status(200).json(user);
    }
    catch(err){
        res.status(err.status).send(err.message);
    }
});

router.delete('/:id/contacts/:contactId', async (req, res) => {
    try{
        const user = await db.users.deleteContact(req.params.id,req.params.contactId);
        res.status(200).json(user);
    }
    catch{
        res.status(err.status).send(err.message);
    }
});

module.exports = router;