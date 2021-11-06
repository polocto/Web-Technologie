/** @jsxImportSource @emotion/react */
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
// Layout
import { useTheme } from "@mui/styles";
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


const getCode= () => {
  const url = window.location.href;
  if(url.match(/code=/g))
    return url.split("code=")[1].split("&")[0];
  else
    return '';
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
              const code = getCode();
              if(!code.length)
              {
                const redirect = auth.redirectURLGeneration();
                window.location.replace(redirect.url);
              }
              const data = auth.codeGrant(code).data;
              console.log(data);
              onUser();
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
