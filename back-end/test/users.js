const supertest = require('supertest');
const app = require('../lib/app');
const db = require('../lib/db/db');

const userTest = {
  username: "polocto",
  email: "paul.sade@live.fr",
  lastName: "Sade",
  firstName: "Paul",
  profileImage: "../image/default.jpg",
}

describe('users', () => {
  
  beforeEach( async () => {
    await db.admin.clear();
  });
  
  it('add one element', async () => {
    // Create a user
    await supertest(app)
    .post('/users')
    .send(userTest)
    .expect(201);
    // Check its return value
    // Check it was correctly inserted
    const {body: users} = await supertest(app)
    .get('/users');
    users.length.should.eql(1);
  });
  
  it('get user by id', async () => {
    // Create a user
    const {body: user} = await supertest(app)
    .post('/users')
    .send(userTest);
    // Check it was correctly inserted
    const {body: user1} = await supertest(app)
    .get(`/users/${user.id}`)
    .expect(200);
    user1.username.should.eql('polocto');
  });
  
  it('get user by email', async () => {
    await supertest(app)
    .post('/users')
    .send(userTest);
    // Check it was correctly inserted
    const {body: user} = await supertest(app)
    .get(`/users/${userTest.email}`)
    .expect(200);
    user.username.should.eql('polocto');
  })
  
  it('modify metadata', async () => {
    const {body: user} = await supertest(app)
    .post(`/users`)
    .send(userTest);
    user.firstName = "Mathis";
    user.lastName = "Camard";
    
    const {body: result} = await supertest(app)
    .put(`/users/${user.id}`)
    .send({
      firstName: "Mathis",
      lastName: "Camard"
    })
    .expect(200);
    
    result.should.match({
      firstName: "Mathis",
      lastName: "Camard"
    });
  });
  
  describe('list', () => {
    it('list empty', async () => {
      // Return an empty user list by default
      const {body: users} = await supertest(app)
      .get('/users')
      .expect(200);
      users.should.eql([]);
    });
    
    it('list one element', async () => {
      // Create a user
      await supertest(app)
      .post('/users')
      .send(userTest);
      // Ensure we list the users correctly
      const {body: users} = await supertest(app)
      .get('/users')
      .expect(200);
      users.should.match([{
        id: /^\w+-\w+-\w+-\w+-\w+$/,
        username: "polocto",
        email: "paul.sade@live.fr",
        lastName: "Sade",
        firstName: "Paul",
        profileImage: "../image/default.jpg",
        onLineStatus: "available"
      }]);
    });
  });
  
  describe('contact', () => {
    const userBeta = {
      username: "mathisCAMARD",
      email: "mathis.camard@edu.ece.fr",
      lastName: "Camard",
      firstName: "Mathis",
      profileImage: "../image/default.jpg"
    };
    
    it('send an invitation', async () => {
      //add users
      const {body: sender}=await supertest(app)
      .post(`/users`)
      .send(userTest);
      const {body: user1}=await supertest(app)
      .post(`/users`)
      .send(userBeta);
      //send an invitation
      const {body: result} = await supertest(app)
      .post(`/users/${sender.id}/contacts/${user1.id}`)
      .expect(200);
      //get the user invited
      const {body: receiver} = await supertest(app)
      .get(`/users/${user1.id}`);
      //verify if the infitantion have been well send and receive
      result.sentInvitation[0].should.match(receiver.id);
      receiver.pendingInvitation[0].should.match(result.id);
      
    });
    
    it('accept an invitation', async () => {
      //add users
      const {body: sender}=await supertest(app)
      .post('/users')
      .send(userTest);
      const {body: receiver} = await supertest(app)
      .post('/users')
      .send(userBeta);
      //send an invitation
      const {body: result} = await supertest(app)
      .post(`/users/${sender.id}/contacts/${receiver.id}`)
      const {body: receiver2} = await supertest(app)
      .get(`/users/${receiver.id}`);
      //accept the invitation
      const {body: resultR} = await supertest(app)
      .post(`/users/${receiver2.id}/contacts/${sender.id}`)
      .expect(200);
      //get the user info of the sender
      const {body: resultS} = await supertest(app)
      .get(`/users/${sender.id}`);
      
      //verify the users have been well removed from invitations
      resultS.sentInvitation.should.eql([]);
      resultR.pendingInvitation.should.eql([]);
      //verify that both users have been well added as contact
      resultS.contacts[0].should.match(resultR.id);
      resultR.contacts[0].should.match(resultS.id);
    });
    
    it('list empty', async () => {
      const {body: user}=await supertest(app)
      .post('/users')
      .send(userTest);
      
      const {body: users}=await supertest(app)
      .get(`/users/${user.id}/contacts`)
      .expect(200);
      
      users.should.eql([]);
      
    });
    
    it('list pending invitation', async () =>{
      //create sender
      const {body: sender}=await supertest(app)
      .post('/users')
      .send(userTest);
      //create receiver
      const {body: receiver} = await supertest(app)
      .post('/users')
      .send(userBeta);
      //send invitation
      await supertest(app)
      .post(`/users/${sender.id}/contacts/${receiver.id}`)
      const {body: receiver1} = await supertest(app)
      .get(`/users/${receiver.id}`);
      //list pending invitation
      const {body: users}=await supertest(app)
      .get(`/users/${receiver1.id}/contacts/pending`)
      .expect(200);


    });
    
    it('list one contact', async () => {
      const {body: sender}=await supertest(app)
      .post('/users')
      .send(userTest);
      
      const {body: receiver} = await supertest(app)
      .post('/users')
      .send(userBeta);
      
      await supertest(app)
      .post(`/users/${sender.id}/contacts/${receiver.id}`);

      const {body: receiver2} = await supertest(app)
      .get(`/users/${receiver.id}`); 
      
      const {body: resultR} = await supertest(app)
      .post(`/users/${receiver2.id}/contacts/${sender.id}`)
      .expect(200);
      
      const {body: users}=await supertest(app)
      .get(`/users/${resultR.id}/contacts`)
      .expect(200);
      
      users.length.should.eql(1);
      users[0].should.match({
        username: 'polocto',
        email: 'paul.sade@live.fr',
        lastName: 'Sade',
        firstName: 'Paul',
        profileImage: '../image/default.jpg',
        onLineStatus: 'available',
        id: /^\w+-\w+-\w+-\w+-\w+$/
      });
    });
    
    it('list sent invitation', async () =>{
      const {body: sender}=await supertest(app)
      .post('/users')
      .send(userTest);
      
      const {body: receiver} = await supertest(app)
      .post('/users')
      .send(userBeta);
      
      await supertest(app)
      .post(`/users/contacts/${receiver.id}`)
      .send(sender);

      const {body: users}=await supertest(app)
      .get(`/users/${sender.id}/contacts/sent`)
      .expect(200);
    });

    it('refuse an invitation', async () => {
      //add users
      const {body: sender}=await supertest(app)
      .post('/users')
      .send(userTest);
      const {body: receiver} = await supertest(app)
      .post('/users')
      .send(userBeta);
      //send invitation
      await supertest(app)
      .post(`/users/${sender.id}/contacts/${receiver.id}`);
      //delete contact
      const {body: resultR} = await supertest(app)
      .delete(`/users/${receiver.id}/contacts/${sender.id}`)
      .expect(200);
      
      const {body: result} = await supertest(app)
      .get(`/users/${sender.id}`);
      
      resultR.pendingInvitation.should.eql([]);
      result.sentInvitation.should.eql([]);
      
    });
    
    it('delete a contact', async () =>  {
      //add users
      const {body: sender}=await supertest(app)
      .post('/users')
      .send(userTest);
      const {body: receiver} = await supertest(app)
      .post('/users')
      .send(userBeta);
      //send an invitation
      await supertest(app)
      .post(`/users/contacts/${receiver.id}`)
      .send(sender);
      //accept the invitation
      await supertest(app)
      .post(`/users/${receiver.id}/contacts/${sender.id}`);
      const {body: resultR} = await supertest(app)
      .delete(`/users/${receiver.id}/contacts/${sender.id}`)
      .expect(200);
      const {body: result} = await supertest(app)
      .get(`/users/${sender.id}`);
      
      resultR.pendingInvitation.should.eql([]);
      result.sentInvitation.should.eql([]);
    });
  })
  
  describe('handle errors', () => {
    
    it('try add existing email', async () => {
      await supertest(app)
      .post('/users')
      .send(userTest)
      .expect(201);
  
      await supertest(app)
      .post('/users')
      .send(userTest)
      .expect(409);    
    });
    
    it('get unvalid user', async () => {
      await supertest(app)
      .get(`/users/1234`)
      .expect(404);
    });
    
    it('modify wrong metadata', async () => {
      const {body: user} = await supertest(app)
      .post('/users')
      .send(userTest);
      
      let copy = {...user};
      copy.id = 1234;
      
      await supertest(app)
      .put(`/users/${copy.id}`)
      .send(copy)
      .expect(404);
      
      copy = {...user};
      copy.email = 1234;
      
      await supertest(app)
      .put(`/users/${user.id}`)
      .send(copy)
      .expect(403);
    });
  });
});
