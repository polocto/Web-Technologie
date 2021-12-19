const db = require('../db/db');
const express = require('express');
const router = express.Router();
const channels = require('./channels');
const StatusError = require('../error');

//get a list of users
router.get('/', async (req, res) => {
    const users = await db.users.list();
    res.status(200).send(users);
});

//create a user
router.post('/', async (req, res) => {
    try {
        const user = await db.users.create(req.body)
        res.status(201).send(user);
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
router.put('/:idUser', async (req, res) => {
    try{
        req.body.id = req.params.idUser;
        const user = await db.users.update(req.body);
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

//get a list of contacts and their information
router.get('/:idUser/contacts', async (req, res) => {
    try{
        const user = await db.users.get(req.params.idUser);
        const result = await db.users.list(user.contacts);
        res.status(200).send(result);
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



router.get('/:idUser/contacts/pending', async (req, res) => {
    try{
        const user = await db.users.get(req.params.idUser);
        const result = await db.users.list(user.pendingInvitation);
        res.status(200).send(result);
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

router.get('/:idUser/contacts/sent', async (req, res) => {
    try{
        const user = await db.users.get(req.params.idUser);
        const result = await db.users.list(user.sentInvitation);
        res.status(200).send(result);
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
router.get('/:idUser', async (req, res) => {
    try{
        const user = await db.users.get(req.params.idUser);
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

//send an invitation
//accept an invitation
router.post('/:idUser/contacts/:idContact', async (req, res) => {
    try{
        let user = await db.users.get(req.params.idUser);
        const match = elem => elem.match(req.params.idContact);

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
            user = await db.users.acceptInvitation(user.id,req.params.idContact);
        }
        else
        {
            user = await db.users.sendInvitation(user.id,req.params.idContact);
        }

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

//delete a contact
//cancel an invitation
//refuse an invitation
router.delete('/:idUser/contacts/:contactId', async (req, res) => {
    try{

        const user = await db.users.get(req.params.idUser);
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
        res.status(200).send(user);
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

router.use('/:idUser/channels', channels);

module.exports = router;