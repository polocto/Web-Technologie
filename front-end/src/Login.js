/** @jsxImportSource @emotion/react */
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
// Layout
import { useTheme } from "@mui/styles";
import auth from "./auth";
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


const getCode= () => {
  const url = window.location.href;
  if(url.match(/code=/g))
    return url.split("code=")[1].split("&")[0];
  else
    return null;
}

const routeConnection = async () => {
  
  const code = getCode();
  const token = Cookies.get("token");
  if(code == null && token == null)
  {
    const data = await auth.redirectURLGeneration();
    Cookies.set(auth.code_verifier,data.code_verifier,{path: 'callback'});
    window.location.replace(data.url);
  }
  else if(token == null) {
    const code_verifier = Cookies.get(auth.code_verifier);
    await auth.codeGrant(code,code_verifier);
    window.location.replace("http://127.0.0.1:3000/");
  }
  else
  {
    const user = await auth.userInfo(JSON.parse(token));
    console.log(user.email);
    console.log("http://127.0.0.1:3000/");
    return user;
  }

  return null;
}

export default function Login({ onUser }) {
  const styles = useStyles(useTheme());
  return (
    <div css={styles.root}>
      <div>
        <fieldset>
          {/* <label htmlFor="username">username: </label> */}
          <TextField id="filled-basic" label="username" variant="filled" />
          {/* <input id="username" name="username" /> */}
        </fieldset>
        <fieldset>
          {/* <label htmlFor="password">password:</label>
          <input id="password" name="password" type="password" /> */}
          <TextField id="filled-basic" label="password" variant="filled" />
        </fieldset>
        <fieldset>
          <Button
            variant="contained"
            onClick={ (e) => {
              e.stopPropagation();
              onUser(routeConnection());
              //{ username: "david" }
            }}
          >
            Login
          </Button>
        </fieldset>
      </div>
    </div>
  );
}
