// ./handles.js
// Necessary imports

const url = require("url");
const qs = require("querystring");

module.exports = {
  serverHandle: function (req, res) {
    const route = url.parse(req.url);
    const path = route.pathname;
    const params = qs.parse(route.query);

    res.writeHead(200, { "Content-Type": "text/plain" });

    res.writeHead(200, { "Content-Type": "text/plain" });
    if(path === "/hello" && "name" in params && (params["name"] == "Paul" || params["name"] == "Mathis")){
      res.write("Hello, our names are Paul and Mathis!! We are both born in 2000. Sorry we don't now what else to say...");
    } else if (path === "/hello" && "name" in params) {
      res.write("Hello " + params["name"]);
    } else {
      res.write("Hey,  do you know that you can pass information throw the link ?\n Add this information to the link : /hello?name=[a name]");
    }

    res.end();
  },
};
