/** @jsxImportSource @emotion/react */
import { useContext, useState } from "react";
import axios from "axios";
// Layout
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/styles";
import Context from "../Context";
import * as React from 'react';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';

const useStyles = (theme) => {
  // See https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/OutlinedInput/OutlinedInput.js
  const borderColor =
    theme.palette.mode === "light"
      ? "rgba(0, 0, 0, 0.23)"
      : "rgba(255, 255, 255, 0.23)";
  return {
    form: {
      borderTop: `2px solid ${borderColor}`,
      padding: ".5rem",
      display: "flex",
      backgroundColor: theme.palette.primary.light,
    },
    content: {
      flex: "1 1 auto",
      backgroundColor: theme.palette.primary.contrastText,
      "&.MuiTextField-root": {
        marginRight: theme.spacing(1),
      },
    },
    send: {
      position: "relative",
      
    },
  };
};

export default function Form({ addMessage, channel }) {
  const { user, oauth , setUser} = useContext(Context);
  const [content, setContent] = useState("");
  const styles = useStyles(useTheme());
  const onSubmit = async () => {
    const { data: message } = await axios.post(
      `http://localhost:3001/users/${user.id}/channels/${channel.id}/messages`,
      {
        content: content,
      },
      {
        headers: {
          Authorization: `Bearer ${oauth.access_token}`,
        },
      }
    );
    setUser({...user});
    addMessage(message);
    setContent("");
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  };
  return (
    <form css={styles.form} onSubmit={onSubmit} noValidate>
       <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '90%' }}>
        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 2 }} />
        <TextField
        id="outlined-multiline-flexible"
        label="Message"
        multiline
        maxRows={4}
        value={content}
        onChange={handleChange}
        variant="outlined"
        css={styles.content}
      />
      </Box>
      <div>
        <Button id="sendButton"
          variant="contained"
          color="primary"
          css={styles.send}
          endIcon={<SendIcon />}
          onClick={onSubmit}
        >
          Send
        </Button>
      </div>
    </form>
  );
}
