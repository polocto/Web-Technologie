
/** @jsxImportSource @emotion/react */
import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { Context } from './Context';
// Layout
import { Link } from '@mui/material';

const styles = {
  root: {
    minWidth: '200px',
  },
  channel: {
    padding: '.2rem .5rem',
    whiteSpace: 'nowrap', 
  }
}

export default function Channels({
  onChannel
}) {
  const {access_token} = useContext(Context);
  const [channels, setChannels] = useState([])
  useEffect( () => {
    const fetch = async () => {
      const {data: channels} = await axios.get('http://localhost:3001/channels',{
        headers: {
            authorization: `${access_token}`
        }
    })
      setChannels(channels)
    }
    fetch()
  }, [])
  return (
    <ul style={styles.root}>
      { channels.map( (channel, i) => (
        <li key={i} css={styles.channel}>
          <Link
            href="#"
            onClick={ (e) => {
              e.preventDefault()
              onChannel(channel)
            }}
            >
            {channel.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
