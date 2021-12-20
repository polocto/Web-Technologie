
import { Box } from "@mui/system"
import { Button } from "@mui/material"
import React, { useContext, useState } from "react";
import { Popover } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { Typography } from "@mui/material";
import Context from "../Context";
import { useEffect } from "react";
import axios from "axios";
import config from "../config";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';


export default function AddUser({users, setUsers}){

    const [anchorEl, setAnchorEl] = useState(null);
    const [contacts,setContacts] = useState([]);
    const {user,oauth} = useContext(Context);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    function handleAdd(){

    }
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    useEffect(()=>{

        async function fetch(){
            try{
                let temp = [];
                const {data: result} = await axios.get(`http://localhost:${config.port}/users/${user.id}/contacts`,
                {
                  headers: {
                    Authorization: `Bearer ${oauth.access_token}`,
                  },
                })
                // console.log(temp);
                // console.log(users)
                temp = {...result}
                await Promise.all(users.map(user => {
                    const index = temp.findIndex(elem => elem.id.match(user.id))
                    console.log(index);
                    if(index>=0)
                    {
                        temp = {...temp.slice(index,1)};
                    }
                    return new Promise((resolve,reject)=>{
                        resolve(temp);
                    })
                }))
                setContacts([...temp]);
            }
            catch(error)
            {
                console.log(error)
            }
        }
        fetch();

    },[user, oauth])

    const open = Boolean(anchorEl);
    if(!contacts.length)
        return (<div></div>);
    return (<Box>
        <Button  variant="contained" onClick={handleClick}>
            Add Users
            </Button>
            <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            >
                        
                    {
                        contacts.map((contact)=>{
                            return (
                            <Box>

                            <Typography id="outlined-read-only-input" disabled>
                                {/* Insert image */}
                                {contact.username}
                            </Typography>
                            <Fab size="small" onClick={(e)=>{
                                e.preventDefault();
                                handleAdd(contact);
                            }} ><AddIcon/></Fab>
                            </Box>
                            )
                            
                        })
                    }
            </Popover>
    </Box>)
}