/** @jsxImportSource @emotion/react */
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
// Layout
import { useTheme } from "@mui/styles";

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
            onClick={(e) => {
              e.stopPropagation();
              onUser({ username: "david" });
            }}
          >
            Login
          </Button>
        </fieldset>
      </div>
    </div>
  );
}
