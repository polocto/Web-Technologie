# Objects Description and Use

This is a presentation of the differents object that will be use and an explanation of how it should be used for our project. We'll describe the different functionalities and a way to handle it. It composed of 3 types of objects:
- [Channels](#channels)
- [Users](#users)
- [Messages](#messages)


## Channels
Here will see how a channel works.

### Attributes
---
- `id` unique id for the channel
- `name` The name of the channel is mandatory everyone can modify it
- `profileImage` Profile Image one is put by default everyone can modify it
- `lastModification` Time of the last modification **updated to each modification** made in the channel
- `numberOfUserHavingAccess` Number Of User that have access to the conversation (present or past) as long it appears in someone list of channels this number is > 0.
- `admin` is a list of users who have specifics rights on the channel, can suppress the channel, kick out users, add other admin but can't deny admin rights or kick out an admin
    - Their have to be at least 1 `admin`
- `users` is the list of users which have been part of the conversation since its creation
    - `user` is the id of the user in order to be able to access it
    - `presentTime` is a list of the times when the user have been part of the conversation
        - `arrivalTime` is the time when the user arrived into the channel
        - `departureTime` is the time when the user left the channel, **this attribute does not exist if the user is part of the channel**
- `pinned` messages of the channel
- `shareFile` The shared links during the conversation
- `shareImage` the shared images during the conversation
- `shareLinks` the shared Links during the conversation

### Creation
---
The user who creates a channel will have to give a `name` to the channel, specify the `users` be part of the channel which determine the `numberOfUserHavingAccess`. He will be by default designated as an `admin`. Each invited `user` will have the **same `arrivalTime` timeStamp**. `lastModification` will be initialize.

### Manage users of the Channel
---
We **never suppress users from a channel** because it have no sens if we delete someone, that the channel vanish from his list of channels. If we **suppress him from the channel but he still has acces to it**, as long messages are stored in the channel **he will have access to all messages**. **We want him to have access to the previous messages when he was a member of the group**. We will **manage his access to some messages**.

#### Manage the user access to messages
---
- Each users have a **list** of **arrival time** and **departure time**. If the messages are not part of one of this interval, he will not be able to access it. When the user charge the messages the back-end only returns the messages in the good time interval.

#### Suppress the user from a channel
---
As said before we won't suppress a user from a channel but his access to new messages. Three way for this
- User leave the channel
- User delete the channel
- The `admin` kick him out of it
If there's one of this two event a `departureTime` will be define so he won't have access to it anymore.

> Admin case

If the admin leave the conversation and if there's is no other admin the older user in the conversation will be designate. If there is no other user there's no admin define (!! the conversation will not be active anymore but only readable)

### Suppress a Channel
---
#### From a user list
- Decrement the `numberOfUserHavingAccess` by one
#### Definitive
- Every `users` of the channel have delete it, so the `numberOfUserHavingAccess` is equal to 0.
- `admin` suppress it for everyone

### List
---
#### Users of the conversation
- Only the ones who do not have a `departureTime` in the last object of the array `presentTime`

#### Shared document & `pinnned` messages
- Everyone can access to them, [same](#manage-the-user-access-to-messages) startegy as messages
- Everyone or only the admin can **pinned messages** ?

### Modify Channel's metadata
- Anyone can modify the `name` and the `profileImage`.
- Everyone can add new members this will increment the `numberOfUserHavingAccess`.
- Only admin can kickout a `user` this will add to the `user` a `departureTime`.
- A `user` can chose to leave a channel this will add a `departureTime` to the `user`.

### Implementation in json
---
```json
{
    "id": "<id>",
    "name": "exemple nom",
    "profileImage": "photo.jpg", 
    "lastModification": "<timeStamp>", 
    "numberOfUserHavingAccess": "<n>",
    "admin": ["<isUser>"],
    "users": 
    [ 
        {
            "user": "<idUser>",
            "presentTime": 
            [
                {
                    "arrivalTime": "<timeStamp>", 
                }
            ]
        },
        {
            "user": "<idUser>",
            "presentTime": 
            [
                {
                    "arrivalTime": "<timeStamp>", 
                    "departureTime": "<timeStamp>"
                 },
                ...,
                {
                    "arrivalTime": "<timeStamp>" 
                }
            ]
        }, 
      ...
    ],
    "pinned": [
        {
            "creation": "<creation>",
            "added": "<timestamp>"
        },
        ...
    ],
    "shareFile": [
        {
            "creation": "<creation>",
            "file": "<file>",
        },
        ...
    ],
    "shareImage": [
        {
            "creation": "<creation>",
            "file": "<file>",
        },
        ...
    ],
    "shareLinks": [
        {
            "creation": "<creation>",
            "file": "<file>",
        },
        ...
    ]
}
```

## Users
User are the core of the application.

### Create
---
When use openid connection, the user should be automatically created if doesn't exist in the database.

The **`email`** is used as an **id**.

>Mandatory
- `id` created by default
- `email` is mandatory to create an account
- `username` ask the user to fill it, if too hard take fisrt par of `email` before "@"
>Default
- `onLineStatus` online when connected and pass offline if disconnect
- `profileImage` if none choosen by the user one is chosen by default
>Not Mandatory
- `lastName` will be added if the user choose to add one
- `firstName` will be added if the user choose to add one
- `channels` ids will be listed when the user will be invited to one or when the user creates one
- `contacts` userId will be added when the user will be added
- `importantMessages` will be create when user select important messages

### Modify
---
Having an `id` make possible to change the email address.

>Modifiable
- `username`
- `onLineStatus`
- `profileImage`
- `lastName`
- `firstName`
- `channels`
- `contacts`
- `importantMessages`

`channels` look [here](#manage-users-of-the-channel)
- You can create one also

`contacts` there's no demands you just add it and you can send some messages
- Add them by email address
- blocked act as a filter need to think about it

- `importantMessages` store messages from channels as important

### Delete
---
- Don't delete all informations of the `user` to keep channel's consistency, keep `email` and `username`, add a parameter `deleted`
- Leave all channels by defining a `departureTime`.
- Delete him from:
    - all its contact
    - Pending invitation

### Implementation
---
```json
{
    "id": "<id>",
    "username": "<username>", 
    "email": "<e-mail>", 
    "lastName": "<last name>", 
    "firstName": "<first name>", 
    "profileImage": "<image>", 
    "channels": [
        {
            "channel": "<idChannel>", 
            "notification": true
        },
        {
            "channel": "<idChannel>",  
            "notification": false
        },
        ...
    ],
    "onLineStatus": "off ligne", 
    "contacts": ["<idUser>", "<idUser>",...],
    "pendingInvitation": ["<idUser>", "<idUser>",...],
    "sentInvitation": ["<idUser>", "<idUser>",...],
    "importantMessages": 
    [
        {
            "channelId": "<channelID>", 
            "creation": "<creation>"
        },
        ...
    ]
}

{
    "id": "<id>",
    "username": "<username>", 
    "email": "<e-mail>", 
    "deleted": true
}
```
## Messages
Messages are the basic of the application since it's a message application. However there's no much things that depends on messages so they are quit simple to manage.


### Implementation
```json
{
    "channelId": "<channelId>", 
    "creation": "<timeStamp>", 
    "modification": "<timeStamp>",
    "creator": "<userId>", 
    "content": "<content>", 
    "readed": 
    [
        {
            "user": "<idUser>",
            "readed": true
        },
        ...
    ], 
    "pinned": false, 
    "important": ["<userId>",...],
    "reactions": 
    [
        {
            "emoji": "<emoji>",
            "users": [ "<idUser>", "<idUser>", ...]
        },
        {
            "emoji": "<emoji>",
            "users": [ "<idUser>", "<idUser>", ...]
        },
        ...
    ]
}
```