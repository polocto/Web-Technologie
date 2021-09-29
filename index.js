// Import a module
const http = require('http')

// Define a string constant concatenating strings
const content = '<!DOCTYPE html>' +
'<html>' +
'    <head>' +
'        <meta charset="utf-8" />' +
'        <title>ECE AST</title>' +
'    </head>' + 
'    <body>' +
'       <p>Hello World!</p>' +
'    </body>' +
'</html>'

// Import Node url module
const url = require('url')

const serverHandle = function (req, res) {
  // Retrieve and print the current path
  const path = url.parse(req.url).pathname;
  console.log(path);

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(content);
  res.end();
}

// Declare an http server
const server = http.createServer(serverHandle);
server.listen(8080)
