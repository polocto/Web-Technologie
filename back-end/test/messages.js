
const supertest = require('supertest');
const microtime = require('microtime');
const app = require('../lib/app');
const db = require('../lib/db');
const users = [
  {
    id: "185-185-1564-54-564"
  },
  {
    id: "185-185-153-54-564"
  }
];
const channelTest = {
  name: 'channel 1',
  profileImage: '../img/default.png',
  admin: ["185-185-1564-54-564"],
  users: [...users],
  numberOfUserHavingAccess: users.length,
}

describe('messages', () => {
  
  beforeEach( async () => {
    await db.admin.clear();
  });
  
  it('list empty', async () => {
    // Create a channel
    const {body: channel} = await supertest(app)
    .post('/channels')
    .send(channelTest);
    // Get messages
    const {body: messages} = await supertest(app)
    .get(`/channels/${channel.id}/messages`)
    .expect(200);
    messages.should.eql([]);
  });
  
  it('list one message', async () => {
    // Create a channel
    const {body: channel} = await supertest(app)
    .post('/channels')
    .send(channelTest);
    // and a message inside it
    await supertest(app)
    .post(`/channels/${channel.id}/messages`)
    .send({author: 'whoami', content: 'Hello ECE'});
    // Get messages
    const {body: messages} = await supertest(app)
    .get(`/channels/${channel.id}/messages`)
    .expect(200);
    messages.should.match([{
      author: 'whoami',
      creation: (it) => it.should.be.approximately(microtime.now(), 1000000),
      content: 'Hello ECE'
    }]);
  });
  
  it('add one element', async () => {
    // Create a channel
    const {body: channel} = await supertest(app)
    .post('/channels')
    .send(channelTest);
    // Create a message inside it
    const {body: message} = await supertest(app)
    .post(`/channels/${channel.id}/messages`)
    .send({author: 'whoami', content: 'Hello ECE'})
    .expect(201);
    message.should.match({
      author: 'whoami',
      creation: (it) => it.should.be.approximately(microtime.now(), 1000000),
      content: 'Hello ECE'
    });
    // Check it was correctly inserted
    const {body: messages} = await supertest(app)
    .get(`/channels/${channel.id}/messages`);
    messages.length.should.eql(1);
  });
  
  it('access invalid channel', async () => {
    // Get messages
    const {body: messages} = await supertest(app)
    .get(`/channels/1234/messages`)
    .expect(404);
  });
  
});
