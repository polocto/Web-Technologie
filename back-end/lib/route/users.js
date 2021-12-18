const db = require('../db/db');
const express = require('express');
const router = express.Router();
const StatusError = require('../error');

//get a list of users
router.get('/', async (req, res) => {
    const users = await db.users.list();
    res.status(200).json(users);
});

//create a user
router.post('/', async (req, res) => {
    try {
        const user = await db.users.create(req.body)
        res.status(201).json(user);
    }
    catch(err ){
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

//update a user
router.put('/', async (req, res) => {
    try{
        const user = await db.users.update(req.body);
        res.status(200).json(user);
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

//get a list of contacts and their information
router.get('/contacts', async (req, res) => {
    try{
        const user = await db.users.get(req.body.id);
        const result = await db.users.list(user.contacts);
        res.status(200).json(result);
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



router.get('/contacts/pending', async (req, res) => {
    try{
        const user = await db.users.get(req.body.id);
        const result = await db.users.list(user.pendingInvitation);
        res.status(200).json(result);
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

router.get('/contacts/sent', async (req, res) => {
    try{
        const user = await db.users.get(req.body.id);
        const result = await db.users.list(user.sentInvitation);
        res.status(200).json(result);
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

//get user from id or email
router.get('/:id', async (req, res) => {
    try{
        const user = await db.users.get(req.params.id);
        res.status(200).json(user);
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

//send an invitation
//accept an invitation
router.post('/contacts/:id', async (req, res) => {
    try{
        let user = await db.users.get(req.body.id);
        const match = elem => elem.match(req.params.id);

        if(user.sentInvitation.some(match))
        {
            throw new StatusError(409,"You already sent an invitation");
        }
        else if(user.contacts.some(match))
        {
            throw new StatusError(409,"Already in your contacts");
        }
        else if(user.pendingInvitation.some(match))
        {
            user = await db.users.acceptInvitation(user.id,req.params.id);
        }
        else
        {
            user = await db.users.sendInvitation(user.id,req.params.id);
        }

        res.status(200).json(user);
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

//delete a contact
//cancel an invitation
//refuse an invitation
router.delete('/contacts/:contactId', async (req, res) => {
    try{

        const user = await db.users.get(req.body.id);
        const contact = await db.users.get(req.params.contactId);

        const match = element => element.match(contact.id);

        if(user.pendingInvitation.some(match))
        {
            user.pendingInvitation.splice(user.pendingInvitation.indexOf(contact.id),1);
            contact.sentInvitation.splice(contact.sentInvitation.indexOf(user.id),1);
        }
        else if(user.sentInvitation.some(match))
        {
            user.sentInvitation.splice(user.sentInvitation.indexOf(contact.id),1);
            contact.pendingInvitation.splice(contact.pendingInvitation.indexOf(user.id),1);
        }
        else if(user.contacts.some(match))
        {
            user.contacts.splice(user.contacts.indexOf(contact.id),1);
            contact.contacts.splice(contact.contacts.indexOf(user.id),1);
        }
        else
        {
            throw new StatusError(404,"This user is in any list");
        }

        
        await db.users.update(contact);
        await db.users.update(user);
        res.status(200).json(user);
    }
    catch{
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

module.exports = router;