const db = require("./db");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const config = require("./config");
const app = express();
const { Buffer } = require('buffer');

app.use(require("body-parser").json());
app.use(cors());

// app.get("*", async (req,res)=>{
//   const token = '';
//   try {
//       const header = JSON.parse(
//           Buffer.from(
//               token
//               .split('.')[0], 'base64'
//               ).toString('utf-8'));
//       const {publicKey, rsaPublicKey} = await jwksClient({
//           jwksUri: auth.jwks_uri
//       }).getSigningKey(header.kid);
  
//       const key = publicKey || rsaPublicKey;
  
//       const payload = jwt.verify(id_token,key);
//       console.log("Token Valide");
//       res.send(payload);

//   } catch (error) {
//       console.error(error);
//       console.log("Token Invalid");
//       res.send(null);
//   }
// });

app.get("/", (req, res) => {
  res.send(["<h1>ECE DevOps Chat</h1>"].join(""));
});

// Channels

app.get("/channels", async (req, res) => {
  const channels = await db.channels.list();
  res.json(channels);
});

app.post("/channels", async (req, res) => {
  const channel = await db.channels.create(req.body);
  res.status(201).json(channel);
});

app.get("/channels/:id", async (req, res) => {
  const channel = await db.channels.get(req.params.id);
  res.json(channel);
});

app.put("/channels/:id", async (req, res) => {
  const channel = await db.channels.update(req.body);
  res.json(channel);
});

// Messages

app.get("/channels/:id/messages", async (req, res) => {
  const messages = await db.messages.list(req.params.id);
  res.json(messages);
});

app.post("/channels/:id/messages", async (req, res) => {
  const message = await db.messages.create(req.params.id, req.body);
  res.status(201).json(message);
});

// Users

app.get("/users", async (req, res) => {
  const users = await db.users.list();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = await db.users.create(req.body);
  res.status(201).json(user);
});

app.get("/users/:id", async (req, res) => {
  const user = await db.users.get(req.params.id);
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  const user = await db.users.update(req.body);
  res.json(user);
});

module.exports = app;
