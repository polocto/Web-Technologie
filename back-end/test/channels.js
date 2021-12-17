
const supertest = require('supertest');
const app = require('../lib/app');
const db = require('../lib/db/db');
const microtime = require('microtime');

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

let channelTest ;

let user1,user2;

describe('channels', () => {
  
  beforeEach( async () => {
    await db.admin.clear();
    const {body: temp1} = await supertest(app)
    .post('/users')
    .send(user_1);
    const {body: temp2} = await supertest(app)
    .post('/users')
    .send(user_2);
    user1 = temp1;
    user2 = temp2;
    channelTest = {
      name: "test",
      profileImage: "../img/lol.png",
      users: [user1.id,user2.id]
    }
  });
  
  describe( 'list', () => {
  
    it('list empty', async () => {
      // Return an empty channel list by default
      const {body: channels} = await supertest(app)
      .get('/channels')
      .send(user1.id)
      .expect(200);
      channels.should.eql([]);
    });
    
    it('list one element', async () => {
      // Create a channel
      const {body: user}=await supertest(app)
      .post('/channels')
      .send([{...channelTest}, user1.id]);
      // Ensure we list the channels correctly
      const {body: channels} = await supertest(app)
      .get('/channels')
      .send(user.channels)
      .expect(200);
      channels.should.match([{
        id: /^\w+-\w+-\w+-\w+-\w+$/,
        name: 'channel 1',
        profileImage: '../img/default.png',
        admin: [user1.id],
        users: [
          {
            id: user1.id,
            presentTime: [
              {
                arrivalTime: (it) => it.should.be.approximately(microtime.now(), 1000000)
              }
            ]
          },
          {
            id: user2.id,
            presentTime: [
              {
                arrivalTime: (it) => it.should.be.approximately(microtime.now(), 1000000)
              }
            ]
          }
        ],
        pinned: [],
        shareFile: [],
        shareImage: [],
        shareLinks: []
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
