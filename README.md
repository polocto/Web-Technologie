
# Chat application - final project

Is a chat application containg different features such as:
- OAuth
- Send Invitaion
- Cancel Invitation
- Accept Invitation
- Refuse Invitation
- Create a Channel
- Delete a Channel
- Modify a message
- Delete a message
- ...

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
  
  yarn run develop
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

