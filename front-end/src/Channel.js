/** @jsxImportSource @emotion/react */
import React from "react";
import { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
// Layout
import { useTheme, styled } from "@mui/styles";
import { Box, Fab, IconButton, Typography, Drawer } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// Local
import Form from "./channel/Form";
import List from "./channel/List";
import Context from "./Context";
import { useNavigate, useParams } from "react-router-dom";
import config from "./config";
import InfoChannel from "./channel/InfoChannel";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import MenuIcon from '@mui/icons-material/Menu';

const useStyles = (theme) => ({
  root: {
    height: "100%",
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflowX: "auto",
    
  },
  fab: {
    position: "absolute !important",
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabDisabled: {
    display: "none !important",
  },
});
const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function Channel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, channels, oauth } = useContext(Context);
  const [channel,setChannel] = useState(channels.find((channel) => channel.id === id));//const channel = channels.find((channel) => channel.id === id);//const [channel,setChannel] = useState(null);
  const styles = useStyles(useTheme());
  const listRef = useRef();
  const [messages, setMessages] = useState([]);
  const [scrollDown, setScrollDown] = useState(false);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const addMessage = (message) => {
    setMessages([...messages, message]);
  };
  const removeMessage = (index) => {
    messages.splice(index,1);
    setMessages([...messages]);
  }

  useEffect(() => {
    const fetch = async () => {


      try{

        const { data: chan } = await axios.get(
          `http://localhost:${config.port}/users/${user.id}/channels/${id}`,
          {
            headers: {
              Authorization: `Bearer ${oauth.access_token}`,
            },
          }
        );
        setChannel({...chan})

      }
      catch(err){

      }




      try {
        const { data: messages } = await axios.get(
          `http://localhost:${config.port}/users/${user.id}/channels/${id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${oauth.access_token}`,
            },
          }
        );
        setMessages(messages);
        if (listRef.current) {
          listRef.current.scroll();
        }
      } catch (err) {
        navigate("/oups");
      }
    };
      fetch();
  }, [id, oauth, navigate, user]);


    const onScrollDown = (scrollDown) => {
      setScrollDown(scrollDown);
    };
    const onClickScroll = () => {
      listRef.current.scroll();
    };
    // On refresh, context.channel is not yet initialized
    if (!channel) {
      return <div>loading</div>;
    }
    return (
      // div de gauche à droite
      <div css={styles.root}>
        {/* Box de haut en bas */}
        {/* Box de gauche à droie */}
        <div id="testFooter">
            <Typography id="titreChannel" variant="h3" >{channel.name}</Typography>
            <IconButton id="buttonDraw"
            color="inherit"
            aria-label="open drawer"
            edge="end"
            height="5px"
            width="20px"
            onClick={handleDrawerOpen}
            sx={{ ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
        
          <DrawerHeader />
  </div>
          <List
            channel={channel}
            messages={messages}
            onScrollDown={onScrollDown}
            ref={listRef}
            removeMessage={removeMessage}
            />
          <Fab
            color="primary"
            aria-label="Latest messages"
            css={[styles.fab, scrollDown || styles.fabDisabled]}
            onClick={onClickScroll}
            >
            <ArrowDropDownIcon />
          </Fab>
          <Form addMessage={addMessage} channel={channel} />

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
        >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <InfoChannel channel={channel} setChannel={setChannel} />
      </Drawer>
        </div>
  );
}
