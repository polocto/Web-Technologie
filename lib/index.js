const express = require("express");
const app = express();
const config = {
  port: 3000,
};
const url = require("url");
const qs = require("querystring");
const db = require("./db");
const { list } = require("./db");

// const data = {
//   channels: [{
//       id: '1',
//       name: 'Channel 1',
//   }, {
//       id: '2',
//       name: 'Channel 2',
//   }, {
//       id: '3',
//       name: 'Channel 3',
//   }]
// };

app.get("/", (req, res) => {
  // Project homepage
  // Return some HTML content inside `body` with:
  // * The page title
  // * A link to the `/channels` page
  // Don't bother with the `head` tag
  const content =
    "<!DOCTYPE html>" +
    "<html>" +
    "    <body>" +
    "       <h1>Welcome</h1>" +
    "       <a href=http://localhost:3000/channels>Click here</a>" +
    "    </body>" +
    "</html>";
  res.send(content);
});

app.get("/channels", (req, res) => {
  // List of channels
  // Return some HTML content inside `body` with:
  // * The page title
  // * A list of every channel with a link to the channel page
  // Notes:
  // * Channels are identified by channel ids.
  // * Make sure to find the appropriate HTML tag to respect the HTML semantic
  //   of a list
  let channels = db.list();
  let list = "";
  for (let i = 0; i < channels.length; i++) {
    list +=
      "<li><a href=http://localhost:3000/channel/" +
      channels[i].id +
      ">" +
      channels[i].name +
      "</a></li>";
  }

  const content =
    "<!DOCTYPE html>" +
    "<html>" +
    "    <body>" +
    "       <h1>Channels</h1>" +
    "       <ul>" +
    list +
    // "           <li><a href=http://localhost:3000/channel/1>Channel 1</a></li>" +
    // "           <li><a href=http://localhost:3000/channel/2>Channel 2</a></li>" +
    // "           <li><a href=http://localhost:3000/channel/3>Channel 3</a></li>" +
    "       </ul>" +
    "    </body>" +
    "</html>";
  res.send(content);
});

app.get("/channel/:id", (req, res) => {
  // Channel information
  // Print the channel title
  const content =
    "<!DOCTYPE html>" +
    "<html>" +
    "    <body>" +
    "       <h1> " +
    db.get(req.params.id - 1) +
    "</h1>" +
    "</body>" +
    "</html>";

  res.send(content);
});

app.listen(config.port, () => {
  console.log(`Chat is waiting for you at http://localhost:${config.port}`);
});
