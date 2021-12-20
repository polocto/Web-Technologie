/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from "@mui/styles";
import { Grid, Typography } from "@mui/material";
import { ReactComponent as ChannelIcon } from "./icons/channel.svg";
import { ReactComponent as FriendsIcon } from "./icons/friends.svg";
import { ReactComponent as SettingsIcon } from "./icons/settings.svg";
import { Button, TextField, ButtonGroup, Fab } from "@mui/material";
import { grid } from "@mui/system";
import { useState } from "react";

const useStyles = (theme) => ({
  root: {
    height: "100%",
    flex: "1 1 auto",
    display: "flex",
    // background: 'rgba(0,0,0,.2)',
  },
  card: {
    position: "absolute",
    textAlign: "center",
    bottom: "20%",
    justifyContent: "center",
  },
  icon: {
    width: "30%",
    fill: "#fff",

    justifyContent: "center",
  },
});

export default function Welcome() {
  const styles = useStyles(useTheme());
  const [data,setData]=useState(null);
  const [print, setPrint]=useState(false);
  function getData(val){
    setData(val.target.value)
  }
  return (
    <div id="channelList" css={styles.root}>
      <Grid
        backgroundColor="#6C7070"
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <form id="marche">
          <img
            id="ProfilImage"
            // src="https://www.pngitem.com/pimgs/b/296-2969032_mlg-doge-png.png"
            src={data}
            alt="profilImage"
            width="100"
            height="100"
          ></img>
          <TextField
            variant="filled"
            label="Nom"
            margin="dense"
            value="CAMARD"
            alignItems="center"
            color="secondary"
          />
          <Button variant="contained">Edit</Button>

          <br></br>

          <TextField
            variant="filled"
            label="Prenom"
            margin="dense"
            value="Mathis"
            alignItems="center"
            color="secondary"
          />
          <Button variant="contained">Edit</Button>
          <br></br>

          <TextField
            variant="filled"
            label="e-mail"
            margin="dense"
            value="matt.camard@gmail.com"
            alignItems="center"
            color="secondary"
          />
          <Button variant="contained">Edit</Button>
          <br></br>

          <TextField
            variant="filled"
            label="Profil picture"
            margin="dense"
            value=""
            alignItems="center"
            color="secondary"
          />
          <Button variant="contained" onClick={()=>setPrint(true)}>Edit</Button>
        </form>

        <div id="crechan" css={styles.card}>
          <ChannelIcon css={styles.icon} />
          <Typography color="textPrimary">Create channels</Typography>
        </div>

        <div id="invfr" css={styles.card}>
          <FriendsIcon css={styles.icon} />
          <Typography color="textPrimary">Invite friends</Typography>
        </div>

        <div id="set" css={styles.card}>
          <SettingsIcon css={styles.icon} />
          <Typography color="textPrimary">Settings</Typography>
        </div>
      </Grid>
    </div>
  );
}
