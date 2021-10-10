# Lab 3 : webtech-back-end

We are building a **Chat application**. This is our first Node.js project with Express.js.

We want to ensure our project adheres to community good practices. This include:

- using a Version Control System (VCS) such as Git
- writing a README to communicate on our project goal, API, usage and status
- generating and maintaining a complete package.json description file
- communicating comprehensive and usefull commits in Git
- maintaining a changelog file
- writing tests to backup our development process
- directory layout (eg: `bin`, `lib`, `test`)
- ...

Once we get all this setup, our new web application will start an HTTP web server with Express.js. It exposes some static routes such as the homepage as well as dynamic routes to print information relative to a given channel, or an error message if the channel does not exist. The route shall match a pattern like `/channel/{channel_id}`.
## Courses
> https://github.com/adaltas/ece-webtech-2021-fall/tree/master/courses/webtech/modules/02.expressjs

# Prerequistes
- Read the following index
> https://github.com/adaltas/ece-webtech-2021-fall/blob/master/webtech/00.prerequisite/index.md

# Installation
- Clone the remote repository to local
```sh
git clone git@github.com:polocto/Web-Technologie.git
```
- Install Exress.js
```sh
npm install express [--save] #--save to add to the dependencies in package.json
```

# Run
```sh
npm start
```
Click on the following link http://localhost:3000/
# Authors
- [Paul SADE](mailto:paul.sade@edu.ece.fr)
- [Mathis Camard](mailto:mathis.camard@edu.ece.fr)

# Liscence
None
