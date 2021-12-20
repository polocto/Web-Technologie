
/** @jsxImportSource @emotion/react */
import {useContext, useEffect} from 'react'
// Layout
import { useTheme } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Drawer } from '@mui/material';
// Local
import Context from './Context'
import Channels from './Channels'
import Channel from './Channel'
import Welcome from './Welcome'
import {
  Route,
  Routes,
} from 'react-router-dom'
import axios from 'axios';
import Contacts from './Contacts';
import CreateChannel from './channel/CreateChannel';
import config from './config';

const useStyles = (theme) => ({
  root: {
    backgroundColor: '#3A3E3E',
    overflow: 'hidden',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  drawer: {
    width: '200px',
    display: 'none',
  },
  drawerVisible: {
    display: 'block',
  },
})

const getUser = async function(setUser, oauth) {
  try{
    const {data: user} = await axios.get(`http://localhost:${config.port}/users/${oauth.email}`,
    {
      headers: {
        Authorization: `Bearer ${oauth.access_token}`,
      },
    });
    setUser(user);
  }
  catch(err)
  {
    const {data: user} = await axios.post(`http://localhost:${config.port}/users`,{email: oauth.email, lastName: 'Sade', firstName: 'Paul', username:'polocto'}, { headers: {Authorization: `Bearer ${oauth.access_token}`,}})
    setUser(user);
  }
}

export default function Main() {
  const {
    // currentChannel, not yet used
    drawerVisible,
    oauth,
    setUser
  } = useContext(Context)

  const theme = useTheme()
  const styles = useStyles(theme)
  const alwaysOpen = useMediaQuery(theme.breakpoints.up('sm'))
  const isDrawerVisible = alwaysOpen || drawerVisible;
  
  useEffect(()=>{

    getUser(setUser,oauth);
  },[oauth,setUser]);
  
  return (
    <main css={styles.root}>
      <Drawer 
        PaperProps={{ style: { position: 'relative', background: '#585d5d',} }}
        BackdropProps={{ style: { position: 'relative' } }}
        ModalProps={{
          style: { position: 'relative' }
        }}
        variant="persistent"
        open={isDrawerVisible}
        css={[styles.drawer, isDrawerVisible && styles.drawerVisible]}
      >
        <Channels />
      </Drawer>
      <Routes>
        <Route path="new" element={<CreateChannel/>}/>
        <Route path="contacts" element={<Contacts/>}/>
        <Route path=":id" element={<Channel />}/>
        <Route path="*" element={<Welcome />}/>
      </Routes>
    </main>
  );
}
