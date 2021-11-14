/** @jsxImportSource @emotion/react */
import { useContext } from "react";
import "./App.css";
// Local
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import Login from "./Login";
import {Context} from "./Context"
//import { Button } from "@material-ui/core";

const styles = {
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#D20FD9",
    padding: "50px",
  },
};

export default function App() {
  const {user} = useContext(Context);
  return (
    <div className="App" css={styles.root}>
      <Header />
      {
        user ? <Main /> : <Login/>
      }
      <Footer />
      {/* <Button variant="contained">Login</Button> */}
    </div>
  );
}
