
/** @jsxImportSource @emotion/react */
import { useContext } from "react";
import { Context } from "./Context";
import { Link } from '@mui/material';

const styles = {
  header: {
    height: '60px',
    backgroundColor: 'rgba(255,255,255,.3)',
    flexShrink: 0,
  },
  headerLogIn: {
    backgroundColor: 'red',
  },
  headerLogOut: {
    backgroundColor: 'blue',
  },
}

export default function Header() {
  const {logout, user} = useContext(Context);
  return (
    <header css={styles.header}>
      {
        user ? <Link href="#" onClick={ (e) => { e.preventDefault(); logout(); }} >Logout {user.email}</Link> : "header"
      }
    </header>
  );
}
