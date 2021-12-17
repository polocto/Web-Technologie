
const supertest = require('supertest');
const app = require('../lib/app');
const db = require('../lib/db');
const microtime = require('microtime');

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

describe('channels', () => {
  
  beforeEach( async () => {
    await db.admin.clear();
  });
  
  describe( 'list', () => {
  
    it('list empty', async () => {
      // Return an empty channel list by default
      const {body: channels} = await supertest(app)
      .get('/channels')
      .expect(200);
      channels.should.eql([]);
    });
    
    it('list one element', async () => {
      // Create a channel
      await supertest(app)
      .post('/channels')
      .send(channelTest);
      // Ensure we list the channels correctly
      const {body: channels} = await supertest(app)
      .get('/channels')
      .expect(200);
      channels.should.match([{
        id: /^\w+-\w+-\w+-\w+-\w+$/,
        name: 'channel 1',
        profileImage: '../img/default.png',
        admin: [/^\w+-\w+-\w+-\w+-\w+$/],
        numberOfUserHavingAccess: 2,
      }]);
    });
    
  });
  
  it('create one element', async () => {
    // Create a channel
    
    const {body: channel} = await supertest(app)
    .post('/channels')
    .send(channelTest)
    .expect(201);
    // Check its return value
    channel.should.match({
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      name: 'channel 1',
      profileImage: '../img/default.png',
      admin: [/^\w+-\w+-\w+-\w+-\w+$/],
      numberOfUserHavingAccess: 2,
    });
    channel.users.map((user)=>{
      user.should.match({
        id: /^\w+-\w+-\w+-\w+-\w+$/,
      });
      user.presentTime[user.presentTime.length-1].should.match({
        arrivalTime: (it) => it.should.be.approximately(microtime.now(), 1000000)
      });
    })
    // Check it was correctly inserted
    const {body: channels} = await supertest(app)
    .get('/channels');
    channels.length.should.eql(1);
  });
  
  it('get channel', async () => {
    // Create a channel
    const {body: channel1} = await supertest(app)
    .post('/channels')
    .send(channelTest);
    // Check it was correctly inserted
    const {body: channel} = await supertest(app)
    .get(`/channels/${channel1.id}`)
    .expect(200);
    channel.name.should.eql('channel 1');
  });
  
});
