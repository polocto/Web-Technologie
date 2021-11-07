import auth from "./auth";

const getCode= () => {
    const url = window.location.href;
    if(url.match(/code=/g))
      return url.split("code=")[1].split("&")[0];
    else
      return null;
  }

const connection =  async () => {
  
    const code = getCode();
    const {token, code_verifier} = await auth.getCookies();
    if(code == null && token == null)//remplacer token == null par non validité du token
    {
      const url = await auth.redirectURLGeneration();
      window.location.replace(url);
    }
    else if(code_verifier != null && code != null){ //remplacer token == null par non validité du token
      await auth.codeGrant(code,code_verifier);
      window.location.replace("http://127.0.0.1:3000/");
    }
    /*else
    {
      const user = await auth.userInfo(JSON.parse(token));
      console.log(user.email);
      console.log("http://127.0.0.1:3000/");
      return user;
    }*/
}

export default connection;