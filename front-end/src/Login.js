/** @jsxImportSource @emotion/react */
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
// Layout
import { useTheme } from "@mui/styles";
import { useEffect, useState } from "react";
import { redirectURLGeneration , authorizationCodeGrant , bearerAuthentication } from "./Auth";
import Cookies from "js-cookie";

const useStyles = (theme) => ({
  root: {
    flex: "1 1 auto",
    background: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "& > div": {
      margin: `${theme.spacing(1)}`,
      marginLeft: "auto",
      marginRight: "auto",
    },
    "& fieldset": {
      border: "none",
      "& label": {
        marginBottom: theme.spacing(0.5),
        display: "block",
      },
    },
  },
});

const getCode = (setCode) => {
    const url = window.location.href;

    if(url.match(/code=/g))
    {
      setCode(url.split(/code=/g)[1].split(/[$&]/g)[0]);
    }
}

export default function Login({ onUser }) {
  const styles = useStyles(useTheme());
  const [code, setCode] = useState(null);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);


  useEffect(()=>{
    getCode(setCode);
    const temp = Cookies.get("token");
    if(temp)
      setToken(JSON.parse(temp));
  },[]);

  useEffect(()=>{
    console.log("Code Verifier")
    const code_verifier=Cookies.get("code_verifier");
    console.log(code_verifier);
    if(code_verifier!=null && code!=null){
      const data = authorizationCodeGrant(code_verifier,code);
      data.then((data)=>{
        Cookies.set("token",JSON.stringify(data));
        window.location.replace("http://127.0.0.1:3000/");
      })
    }
  },[code]);

  useEffect(()=>{
    console.log("Token");
    if(token)
    {
      const data = bearerAuthentication(token.access_token);
      data.then((data)=>{
        onUser({email: data.email});
      });
    }
  },[token]);

  return (
    <div css={styles.root}>
      <div>
        <fieldset>
          {/* <label htmlFor="username">username: </label> */}
          <TextField id="filled-basic" label="username" variant="filled" onChange={(event)=>{setUsername(event.target.value)}}/>
          {/* <input id="username" name="username" /> */}
        </fieldset>
        <fieldset>
          {/* <label htmlFor="password">password:</label>
          <input id="password" name="password" type="password" /> */}
          <TextField id="filled-basic" label="password" type="password" variant="filled" onChange={(event)=>{setPassword(event.target.value)}}/>
        </fieldset>
        <fieldset>
          <Button
            variant="contained"
            onClick={ (e) => {
              if(!username && !password)
              {
                // Appel authentification dex step 1
                const data = redirectURLGeneration();
                Cookies.set("code_verifier",data.code_verifier,{path: "/callback"});
                window.location.replace(data.url);
              }
              else
              {
                // authentification base de donnée
              }
            }}
          >
            Login
          </Button>
        </fieldset>
      </div>
    </div>
  );
}
