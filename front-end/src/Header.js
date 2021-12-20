/** @jsxImportSource @emotion/react */
import { useContext } from "react";
// Layout
import { useTheme } from "@mui/styles";
import { IconButton, Link } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Context from "./Context";
//import { ThemeProvider } from "@emotion/react";
import { Button } from "@mui/material";

const useStyles = (theme) => ({
  header: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.dark,
    flexShrink: 0,
  },
  headerLogIn: {
    backgroundColor: "red",
  },
  headerLogOut: {
    backgroundColor: "blue",
  },
  menu: {
    [theme.breakpoints.up("sm")]: {
      display: "none !important",
    },
  },
});

export default function Header({ drawerToggleListener }) {
  const styles = useStyles(useTheme());
  const { user, setOauth, drawerVisible, setDrawerVisible } =
    useContext(Context);
  const drawerToggle = (e) => {
    setDrawerVisible(!drawerVisible);
  };
  const onClickLogout = (e) => {
    e.stopPropagation();
    setOauth(null);
  };
  return (
    <header css={styles.header}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={drawerToggle}
        css={styles.menu}
      >
        <MenuIcon />
      </IconButton>
      {Header}
      {user ? (
        <ul>
          <div id="head">
            <li id="l1">
              {user.prenom && user.nom
                ? user.prenom + "" + user.nom
                : user.username}
            </li>
            <li id="l2">
              <h1 id="title" width="fitContent">
                LOQUI ROCKET
              </h1>
            </li>
            <li id="l3">
              <Button
                id="logoutButton"
                variant="outlined"
                color="error"
                width="fitContent"
              >
                <Link id="logoutLink" onClick={onClickLogout}>
                  logout
                </Link>
              </Button>
            </li>
          </div>
        </ul>
      ) : (
        <span></span>
      )}
    </header>
  );
}
