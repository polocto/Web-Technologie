/** @jsxImportSource @emotion/react */
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
// Layout
import { useTheme } from "@mui/styles";
import { useEffect, useState } from "react";
import connection from "./connection";
import auth from "./auth";

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

const connect = async (setUser) => 
{
  const {token} = auth.getCookies();
  console.log(token);
  if(token == null)
    setUser(null);
  else 
    await auth.userInfo(JSON.parse(token))
    .then((result) => {
      console.log(result);
      setUser(result);
    });
}

export default function Login({ onUser }) {
  const styles = useStyles(useTheme());
  const [user,setUser] = useState(null);
  console.log("User : ");
  console.log(user);
  const username = user ? user.email : "username";
  return (
    <div css={styles.root}>
      <div>
        <fieldset>
          {/* <label htmlFor="username">username: </label> */}
          <TextField id="filled-basic" label={username} variant="filled" />
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
              connection();
              connect(setUser);
              onUser(user);
            }}
          >
            Login
          </Button>
        </fieldset>
      </div>
    </div>
  );
}
