const db = require("./db");
const express = require("express");
const app = express();

app.use(require("body-parser").json());

app.get("/", (req, res) => {
  res.send(["<h1>ECE DevOps Chat</h1>"].join(""));
});

app.get("/channels", async (req, res) => {
  const channels = await db.channels.list();
  res.json(channels);
});

app.post("/channels", async (req, res) => {
  const channel = await db.channels.create(req.body);
  res.status(201).json(channel);
});

app.get("/channels/:id", (req, res) => {
  const channel = db.channels.get(req.body);
  res.json(channel);
});

app.put("/channels/:id", (req, res) => {
  const channel = db.channels.update(req.body);
  res.json(channel);
});
// USERS
app.get("/users", async (req, res) => {
  const users = await db.users.list();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = await db.users.create(req.body);
  res.status(201).json(user);
});
// MESSAGES

app.get("/channels/:id/messages", async (req, res) => {
  const messages = await db.messages.list(req.params.id)
  res.json(messages)
})

app.post("/channels/:id/messages", async (req, res) => {
  const message = await db.messages.create(req.body,req.params.id)
  res.status(201).json(message)
})

module.exports = app;
