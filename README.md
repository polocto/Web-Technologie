# OAuth

OAuth2 and OpenID Connect enable the delegation of authorisation to an external service, not managed by our application. Dex can even delegate the authentication to multiple connector, an LDAP/AD directory or another OAuth provider like GitHub, thus acting like a federated OpenID Connect provider. We don't have to manage the security endpoints related to our application including account creation, login form, password retrieval, DDoS attacks and many more. It also provide us with an authentication mechanism where no password is being sent to us.

OAuth authentification is included in the messages application.

## Courses
> https://github.com/adaltas/ece-webtech-2021-fall

# Prerequistes
- Node.js
- DEX
- go

# Installation

- Clone the remote repository to local
```sh
git clone git@github.com:polocto/Web-Technologie.git
```
- In both `./front-end` & `./back-end` run the following command
```sh
npm install
```
Modify callback url in dex/examples/config-dev.yaml to `http://127.0.0.1:3000/callback`
# Run
To run this application
- In both `.front-end` & `./back-end` run the following command
```sh
npm start
```
A page will open in your browser. Click on the button with the label 'LOGIN'.

# Authors
- [Paul SADE](mailto:paul.sade@edu.ece.fr)
- [Mathis Camard](mailto:mathis.camard@edu.ece.fr)

# Liscence
None
