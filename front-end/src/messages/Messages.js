import { useTheme } from "@emotion/react";
import { useContext, useEffect } from "react";
// Markdown
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";
// Time
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";
import { Button, TextField, ButtonGroup, Fab } from "@mui/material";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import Context from "../Context";
import axios from "axios";
import { blueGrey } from "@mui/material/colors";

dayjs.extend(calendar);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  calendar: {
    sameElse: "DD/MM/YYYY hh:mm A",
  },
});

const useStyles = (theme) => ({
  message: {
    padding: ".2rem .5rem",
    ":hover": {
      backgroundColor: "rgba(255,255,255,.05)",
    },
  },
});

function onDelete(message, user) {}

async function onModification(
  message,
  setModifiable,
  modifiable,
  content,
  user,
  oauth
) {
  if (modifiable) {
    console.log(message);
    const { data: temp } = await axios.put(
      `http://localhost:3001/users/${user.id}/channels/${message.channelId}/messages/${message.creation}`,
      {
        content: content,
      },
      {
        headers: {
          Authorization: `Bearer ${oauth.access_token}`,
        },
      }
    );
    message = { ...temp };
  }
  setModifiable(!modifiable);
}

function Option({ message, setModifiable, modifiable, content }) {
  const { user, oauth } = useContext(Context);

  return (
    <ButtonGroup
      fontSize="small"
      variant="outlined"
      aria-label="outlined button group"
    >
      <Button
        onClick={() => {
          onModification(
            message,
            setModifiable,
            modifiable,
            content,
            user,
            oauth
          );
        }}
      >
        <ModeEditOutlineRoundedIcon fontSize="small" />
      </Button>
      <Button
        onClick={() => {
          onDelete();
        }}
      >
        <DeleteIcon />
      </Button>
    </ButtonGroup>
  );
}

export default function Message({ key, message }) {
  const { user } = useContext(Context);
  const [content, setContent] = useState(message.content);
  const [modifiable, setModifiable] = useState(false);
  const styles = useStyles(useTheme);

  function handleChange(e) {
    setContent(e.target.value);
  }

  if (user.id.match(message.author.id)) {
    return (
      <li key={key} styles={styles.message} >
        <Option
          message={message}
          setModifiable={setModifiable}
          modifiable={modifiable}
          content={content}
        />
        <TextField
          variant="filled"
          
          label={
            message.author.username + " - " + dayjs().calendar(message.creation)
          }
          disabled={!modifiable}
          margin="dense"
          value={content}
          fullWidth
          onChange={handleChange}
          color="secondary"
          
        />
      </li>
    );
  } else {
    return (
      <li key={key} styles={styles.message}>
        <TextField
          variant="filled"
          label={
            message.author.username + " - " + dayjs().calendar(message.creation)
          }
          disabled={!modifiable}
          margin="dense"
          defaultValue={message.content}
          fullWidth
          color="secondary"
          
        />
      </li>
    );
  }
}
