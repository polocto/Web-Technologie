
const supertest = require('supertest');
const microtime = require('microtime');
const app = require('../lib/app');
const db = require('../lib/db/db');
const user_1 = {
  username: "polocto",
  email: "paul.sade@live.fr",
  lastName: "Sade",
  firstName: "Paul",
  profileImage: "../image/default.jpg",
}

const user_2 = {
  username: "mathisCAMARD",
  email: "mathis.camard@edu.ece.fr",
  lastName: "Camard",
  firstName: "Mathis",
  profileImage: "../image/default.jpg"
};
const channelTest = {
  name: 'channel 1',
  profileImage: '../img/default.png',
  users: []
}

let user, user2, channelId;

describe('messages', () => {
  
  beforeEach( async () => {
    await db.admin.clear();
    const {body: temp1} = await supertest(app)
    .post('/users')
    .send(user_1);
    const {body: temp2} = await supertest(app)
    .post('/users')
    .send(user_2);
    channelTest.users = [temp1.id,temp2.id];
    const {body: temp3} = await supertest(app)
    .post(`/users/${temp1.id}/channels`)
    .send(channelTest)
    .expect(201);
    user = temp3;
    user2 = temp2;
    channelId = user.channels[0];
  });
  
  it('list empty', async () => {
    // Get messages
    const {body: messages} = await supertest(app)
    .get(`/users/${user.id}/channels/${channelId}/messages`)
    .expect(200);
    messages.should.eql([]);
  });
  
  it('list one message', async () => {
    // and a message inside it
    const content = "test message";
    const {body: message} = await supertest(app)
    .post(`/users/${user.id}/channels/${channelId}/messages`)
    .send({content: content});
    message.content.should.eql("test message");
    // Get messages
    const {body: messages} = await supertest(app)
    .get(`/users/${user.id}/channels/${channelId}/messages`)
    .expect(200);
    message.creation = message.creation.toString();
    messages.should.eql([{
      author: {
        id: user.id,
        username: user.username
      },
      channelId: message.channelId,
      content: message.content,
      creation: message.creation
    }]);
  });
  
  it('add one element', async () => {
    // Create a message inside it
    const content = "test message";
    const {body: message} = await supertest(app)
    .post(`/users/${user.id}/channels/${channelId}/messages`)
    .send({content: content})
    .expect(201);
    message.should.match({
      author: {
        id: user.id,
        username: user.username
      },
      creation: (it) => it.should.be.approximately(microtime.now(), 1000000),
      content: content
    });
    // Check it was correctly inserted
    const {body: messages} = await supertest(app)
    .get(`/users/${user.id}/channels/${channelId}/messages`);
    messages.length.should.eql(1);
  });
  
  it('access invalid channel', async () => {
    // Get messages
    const {body: messages} = await supertest(app)
    .get(`/users/${user.id}/channels/1234/messages`)
    .expect(404);
  });

  it('get message', async () => {
    const content = "test message";
    const {body: message} = await supertest(app)
    .post(`/users/${user.id}/channels/${channelId}/messages`)
    .send({content: content})
    .expect(201);

    const {body: result} = await supertest(app)
    .get(`/users/${user.id}/channels/${channelId}/messages/${message.creation}`)
    .expect(200);

    message.creation = message.creation.toString();
    result.should.eql({...message});
  });

  it('delete message', async () => {
    const content = "test message";
    const {body: message} = await supertest(app)
    .post(`/users/${user.id}/channels/${channelId}/messages`)
    .send({content: content})
    .expect(201);
    await supertest(app)
    .delete(`/users/${user.id}/channels/${channelId}/messages/${message.creation}`)
    .expect(200);
    const {body: result} = await supertest(app)
    .get(`/users/${user.id}/channels/${channelId}/messages/${message.creation}`)
    .expect(404);
  });

  //Doesn't wait long enougth, read before precedent action have been written
  it('modify a message', async () => {
    const content = "test message";
    const content2 = "nouveau";
    const {body: message} = await supertest(app)
    .post(`/users/${user.id}/channels/${channelId}/messages`)
    .send({content: content});
    
    const {body: message2} = await supertest(app)
    .put(`/users/${user.id}/channels/${channelId}/messages/${message.creation}`)
    .send({content: content2})
    .expect(200);

    message.content.should.not.eql(message2.content);

     
  })

  it('wrong user try modify a message', async () => {
    const content = "test message";
    const content2 = "nouveau";
    const {body: message} = await supertest(app)
    .post(`/users/${user.id}/channels/${channelId}/messages`)
    .send({content: content});
    
    const {body: message2} = await supertest(app)
    .put(`/users/${user2.id}/channels/${channelId}/messages/${message.creation}`)
    .send({content: content2})
    .expect(401);

    message.content.should.not.eql(message2.content);

     
  })
  
});
