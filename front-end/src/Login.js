/** @jsxImportSource @emotion/react */
import { Button } from "@mui/material";
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
          <label htmlFor="username">username: </label>
          <input id="username" name="username" />
        </fieldset>
        <fieldset>
          <label htmlFor="password">password:</label>
          <input id="password" name="password" type="password" />
        </fieldset>
        <fieldset>
          <Button variant="contained">Login</Button>
          {/* onClick={(e) => {
              e.stopPropagation();
              onUser({ username: "david" });
            } */}
          
        </fieldset>
      </div>
    </div>
  );
}
