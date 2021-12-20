/** @jsxImportSource @emotion/react */
import { useContext, useEffect } from "react";
import axios from "axios";
// Layout
import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
// Local
import Context from "./Context";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import config from "./config";

const styles = {
  root: {
    "& a": {
      padding: ".2rem .5rem",
      whiteSpace: "nowrap",
    },
  },
};

export default function Channels() {
  const { user, oauth, channels, setChannels } = useContext(Context);
  const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: channels } = await axios.get(
          `http://localhost:${config.port}/users/${user.id}/channels`,
          {
            headers: {
              Authorization: `Bearer ${oauth.access_token}`,
            },
          }
        );
        setChannels(channels);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [oauth, user, setChannels]);
  return (
    <div id="channelList">
      <ul css={styles.root}>



        <div class="test">
          <li css={styles.channel}>
            <Button
              id="welcmButton"
              variant="contained"
              href="#contained-buttons"
            >
              <Link id="wlcmLink" to="/channels" component={RouterLink}>
                Parameters
              </Link>
            </Button>
          </li>
          </div>
        <li css={styles.channel}>
          <Button
            id="contactsButton"
            variant="contained"
            href="#contained-buttons"
          >
             <Link id="contactsLink" to="/channels/contacts" component={RouterLink}>
              Contacts
            </Link>
          </Button>
          
        </li>
        <li css={styles.channel}>
          <Button
            id="createChanButton"
            variant="contained"
            href="#contained-buttons"
          >
             <Link id="createChanLink" to="/channels/new" component={RouterLink}>
              Create channel
            </Link>
          </Button>
          
        </li>
        {channels.map((channel, i) => (
          <li id="listeOfChannel" key={i} css={styles.channel}>
            <div id="circle">
              <Link
                id="channelLink"
                href={`/channels/${channel.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/channels/${channel.id}`);
                }}
              >
                {channel.name}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
