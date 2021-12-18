
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
      .send(user1)
      .expect(200);
      channels.should.eql([]);
    });
    
    it('list one element', async () => {
      // Create a channel
      const {body: user}=await supertest(app)
      .post('/channels')
      .send([channelTest, user1]);
      // Ensure we list the channels correctly
      const {body: channels} = await supertest(app)
      .get('/channels')
      .send(user)
      .expect(200);
      channels.should.match([{
        id: /^\w+-\w+-\w+-\w+-\w+$/,
        name: 'test',
        profileImage: '../img/lol.png'
      }]);
    });
    
  });
  
  it('create one element', async () => {
    // Create a channel
    
    const {body: user}=await supertest(app)
    .post('/channels')
    .send([channelTest, user1])
    .expect(201);
    // Check its return value
    user.channels.should.match([/^\w+-\w+-\w+-\w+-\w+$/]);
    user.channels.length.should.eql(1);
    // Check it was correctly inserted
    const {body: channels} = await supertest(app)
    .get('/channels')
    .send(user)
    .expect(200);
    channels.length.should.eql(1);
  });
  
  it('get channel', async () => {
    // Create a channel
    const {body: user}=await supertest(app)
    .post('/channels')
    .send([{...channelTest}, user1]);
    // Check it was correctly inserted
    const {body: channel1} = await supertest(app)
    .get(`/channels/${user.channels[0]}`)
    .send(user1)
    .expect(200);
    channel1.admin.should.eql(true);

    const {body: channel2} = await supertest(app)
    .get(`/channels/${user.channels[0]}`)
    .send(user2)
    .expect(200);
    channel2.admin.should.eql(false);
  });

  it('modify metadata', async () => {
    //Define secandary channel
    let channelBeta = {
      name: "new",
      profileImage: "../img/help.png",
      users: [user1.id]
    };
    // Create a channel
    const {body: user}=await supertest(app)
    .post('/channels')
    .send([{...channelTest}, user1]);
    const {body: channel}=await supertest(app)
    .put(`/channels/${user.channels[0]}`)
    .send([channelBeta, user])
    .expect(200);
    
    
    channel.should.match({
      name: "new",
      profileImage: "../img/help.png"
    });

  });

  describe("delete", ()=>{
    let channelId;
    let temp;
    beforeEach(async ()=>{
      const {body: user}=await supertest(app)
      .post('/channels')
      .send([{...channelTest}, user1]);
      user.channels.length.should.eql(1);
      channelId = user.channels[0];
      const {body: test1}=await supertest(app)
      .delete(`/channels/${channelId}`)
      .send(user)
      .expect(200);
      test1.channels.length.should.eql(0);
      temp = test1;
    })

    it('delete channel from one user', async () => {
  
      let {body: channel1} = await supertest(app)
      .get(`/channels/${channelId}`)
      .send(temp)
      .expect(404);
      
    });
  
    it("delete channel from all channel's user", async () => {
      
      
      const {body: test2} = await supertest(app)
      .get(`/users/${user2.id}`)
      .expect(200);
      const {body: result}=await supertest(app)
      .delete(`/channels/${channelId}`)
      .send(test2)
      .expect(200);
      
      temp.channels.length.should.eql(0);
  
      await supertest(app)
      .get(`/channels/${channelId}`)
      .send(result)
      .expect(404);
  
    });
  });
  
});
