
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
    .post('/channels')
    .send([channelTest, temp1])
    .expect(201);
    user = temp3;
    user2 = temp2;
    channelId = user.channels[0];
  });
  
  it('list empty', async () => {
    // Get messages
    const {body: messages} = await supertest(app)
    .get(`/channels/${channelId}/messages`)
    .send(user)
    .expect(200);
    messages.should.eql([]);
  });
  
  it('list one message', async () => {
    // and a message inside it
    const content = "test message";
    const {body: message} = await supertest(app)
    .post(`/channels/${channelId}/messages`)
    .send([user,content]);
    message.content.should.eql("test message");
    // Get messages
    const {body: messages} = await supertest(app)
    .get(`/channels/${channelId}/messages`)
    .send(user)
    .expect(200);
    message.creation = message.creation.toString();
    messages.should.eql([{...message}]);
  });
  
  it('add one element', async () => {
    // Create a message inside it
    const content = "test message";
    const {body: message} = await supertest(app)
    .post(`/channels/${channelId}/messages`)
    .send([user,content])
    .expect(201);
    message.should.match({
      author: user.id,
      creation: (it) => it.should.be.approximately(microtime.now(), 1000000),
      content: content
    });
    // Check it was correctly inserted
    const {body: messages} = await supertest(app)
    .get(`/channels/${channelId}/messages`);
    messages.length.should.eql(1);
  });
  
  it('access invalid channel', async () => {
    // Get messages
    const {body: messages} = await supertest(app)
    .get(`/channels/1234/messages`)
    .send(user)
    .expect(404);
  });

  it('get message', async () => {
    const content = "test message";
    const {body: message} = await supertest(app)
    .post(`/channels/${channelId}/messages`)
    .send([user,content])
    .expect(201);

    const {body: result} = await supertest(app)
    .get(`/channels/${channelId}/messages/${message.creation}`)
    .send(user)
    .expect(200);

    message.creation = message.creation.toString();
    result.should.eql({...message});
  });

  it('delete message', async () => {
    const content = "test message";
    const {body: message} = await supertest(app)
    .post(`/channels/${channelId}/messages`)
    .send([user,content])
    .expect(201);
    await supertest(app)
    .delete(`/channels/${channelId}/messages/${message.creation}`)
    .send(user)
    .expect(200);
    const {body: result} = await supertest(app)
    .get(`/channels/${channelId}/messages/${message.creation}`)
    .send(user)
    .expect(404);
  });

  //Doesn't wait long enougth, read before precedent action have been written
  it.skip('try get a message after channel is deleted message', async () => {
    const content = "test message";
    const {body: message} = await supertest(app)
    .post(`/channels/${channelId}/messages`)
    .send([user,content]);
    await new Promise((resolve,reject)=>{
      supertest(app)
      .delete(`/channels/${channelId}`)
      .send(user)
      .then(()=>{
        supertest(app)
        .delete(`/channels/${channelId}`)
        .send(user2)
        .then(()=>{
          supertest(app)
          .get(`/channels/${channelId}/messages/${message.creation}`)
          .send(user)
          .expect(404)
          .then(()=>{resolve()});
        })
      })
    });
     
  })
  
});
