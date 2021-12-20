/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from "@mui/styles";
import { Grid, Typography } from "@mui/material";
import { ReactComponent as ChannelIcon } from "./icons/channel.svg";
import { ReactComponent as FriendsIcon } from "./icons/friends.svg";
import { ReactComponent as SettingsIcon } from "./icons/settings.svg";
import { Button, TextField, ButtonGroup, Fab } from "@mui/material";
import Context from "./Context";
import { useContext, useEffect, useState } from "react";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import axios from "axios";
import { grid } from "@mui/system";

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

async function onUpdate(field, content, oauth, setUser){

  let modifcations={};
  modifcations[field] = content;
  console.log(modifcations)
    if(content.length != 0)
    {
      const {data: user} = await axios.put(`http://localhost:3001/users/${oauth.email}`,modifcations,
      {
        headers: {
          Authorization: `Bearer ${oauth.access_token}`,
        },
      });
      console.log(user)
      setUser(user);
    }
}

function handleChange (value, setValue)
{
  setValue(value);
}

export default function Welcome() {
  const styles = useStyles(useTheme());
  const { user, setUser, oauth } = useContext(Context);
  const [prenom,setPrenom] = useState("Prenom");
  const [nom,setNom] = useState("Nom");
  const [username,setUsername] = useState("username");

  const [profileImage,setProfileImage]=useState("https://www.pngitem.com/pimgs/b/296-2969032_mlg-doge-png.png");
  const [print, setPrint]=useState(false);

  useEffect(()=>{
    if(user)
    {
      setPrenom(user.firstName ? user.firstName : "username")
      setNom(user.lastName ? user.lastName : "username")
      setUsername(user.username ? user.username : "username")
      setProfileImage(user.profileImage ? user.profileImage : "https://www.pngitem.com/pimgs/b/296-2969032_mlg-doge-png.png")
    }
  },[user])

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
            src={profileImage}
            alt="profilImage"
            width="100"
            height="100"
          ></img>
          <TextField
            variant="filled"
            margin="dense"
            value={nom}
            alignItems="center"
            color="secondary"
            onChange={(e)=>{
              handleChange(e.target.value,setNom)
            }}
          />
          <Button variant="contained" onClick={(e)=>{
            e.preventDefault();
            onUpdate("lastName",nom,oauth,setUser)
          }} ><ModeEditOutlineRoundedIcon fontSize="small" />Edit</Button>

          <br></br>

          <TextField
            variant="filled"
            margin="dense"
            value={prenom}
            alignItems="center"
            color="secondary"
            onChange={(e)=>{
              handleChange(e.target.value,setPrenom)
            }}
          />
          <Button variant="contained" onClick={(e)=>{
            e.preventDefault();
            onUpdate("firstName",prenom,oauth,setUser)
          }} ><ModeEditOutlineRoundedIcon fontSize="small" />Edit</Button>
          <br></br>

          <TextField
            variant="filled"
            margin="dense"
            value={username}
            alignItems="center"
            color="secondary"
            onChange={(e)=>{
              handleChange(e.target.value,setUsername)
            }}
          />
          <Button variant="contained" onClick={(e)=>{
            e.preventDefault();
            onUpdate("username",username,oauth,setUser)
          }} ><ModeEditOutlineRoundedIcon fontSize="small" />Edit</Button>
          <br></br>

          <TextField
            variant="filled"
            label="Profil picture"
            margin="dense"
            value={profileImage}
            alignItems="center"
            color="secondary"

            onChange={(e)=>{
              handleChange(e.target.value,setProfileImage)
            }}
          />
          <Button variant="contained" onClick={(e)=>{
            e.preventDefault();
            onUpdate("profileImage",profileImage,oauth,setUser)
          }}><ModeEditOutlineRoundedIcon fontSize="small" />Edit</Button>
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
