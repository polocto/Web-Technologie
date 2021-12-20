
# Chat application - final project

*presentation, introduction, ...*

## Usage

* Clone this repository, from your local machine:
  ```
  git clone https://github.com/adaltas/ece-webtech-2021-fall.git webtech
  cd webtech/courses/webtech/project
  ```
* Install [Go](https://golang.org/) and [Dex](https://dexidp.io/docs/getting-started/). For example, on Ubuntu, from your project root directory:   
  ```
  # Install Go
  apt install golang-go
  # Download Dex
  git clone https://github.com/dexidp/dex.git
  # Build Dex
  cd dex
  make
  make examples
  ```
  Note, the provided `.gitignore` file ignores the `dex` folder.
* Register your GitHub application, get the `clientID` and `clientSecret` from GitHub and report them to your Dex configuration. Modify the provided `./dex-config/config.yml` configuration to look like:
  ```yaml
  - type: github
    id: github
    name: GitHub
    config:
      clientID: xxxx98f1c26493dbxxxx
      clientSecret: xxxxxxxxx80e139441b637796b128d8xxxxxxxxx
      redirectURI: http://127.0.0.1:5556/dex/callback
  ```
* Inside `./dex-config/config.yml`, the front-end application is already registered and CORS is activated. Now that Dex is built and configured, you can start the Dex server:
  ```yaml
  cd dex
  bin/dex serve dex-config/config.yaml
  ```
* Start the back-end
  ```bash
  cd back-end
  # Install dependencies (use yarn or npm)
  yarn install
  
  npm run develop
  ```
* Start the front-end
  ```bash
  cd front-end
  # Install dependencies (use yarn or npm)
  yarn install
  # Start the front-end
  yarn start
  ```

---

## Prototype of our application 

- [Figma prototype link](https://www.figma.com/file/G0MED2g3sdk65A6lm9JBV9/WebTech?node-id=0%3A1)

---

## Author

**Paul SADE**
*[paul.sade@edu.ece.fr](mailto:paul.sade@edu.ece.fr)*

**Mathis CAMARD**
*[mathis.camard@edu.ece.fr](mailto:mathis.camard@edu.ece.fr)*

## Tasks

Project management

* Naming convention   
  2/2
* Project structure   
  3/4
* Code quality   
  3/4
* Design, UX   
  2/4
* Git and DevOps   
  3,75

Application development

* Welcome screens   
  3/4
* New channel creation   
  5/6
* Channel membership and access   
  4/4
* Ressource access control   
  4/4
* Invite users to channels   
  4/6
* Message modification   
  2/2
* Message removal   
  2/2
* Account settings   
  3/4
* Gravatar integration   
  0/2
* Avatar selection   
  0/4
* Personal custom avatar   
  3/6

## Bonus

*place your graduation and comments*
4
Devops:
- CI/CD
  - unit test
  - heroku
  - docker Image
- Docker-compose

5
Functionalities:
- Contact
  - Send Invitation
  - Receive Invitation
  - Refuse Invitation
  - Delete Conatct
  - Accept Invitation

2
- Message
  - If we leave the channel an we are reinvited (back-end possible to add users but not front) we have only access to messages when we had access to channel

3
- Channels
  - order channels on the left from the more recent modification to the latest


**Final Grade : 52.75**