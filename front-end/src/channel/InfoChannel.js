import { useContext, useEffect, useState } from "react";
import Context from "../Context";
import AddUser from "./AddUser";
import ListUsers from "./ListUsers";
import MetadataChannel from "./MetadataChannel";
import { Box } from "@mui/system";
import { useTheme } from "@emotion/react";

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


export default function InfoChannel({channel, setChannel}){


    const theme = useTheme()
    const styles = useStyles(theme)
    const [users,setUsers] = useState([]);

    useEffect(()=>{
        if(channel.users)
            setUsers([...channel.users]);
    },[channel])



    return (
        <Box>

            <MetadataChannel channel={channel} setChannel={setChannel} />
            <ListUsers users={users} />
            <AddUser setUsers={setUsers} users={users} />
        </Box>
        );

}