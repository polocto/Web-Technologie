import { TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import Context from "../Context";
import CreateIcon from '@mui/icons-material/Create';
import { useTheme } from "@emotion/react";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import { Fab } from "@mui/material";
import { useNavigate } from "react-router-dom";





export default function CreateChannel(){
    const {user,setUser, oauth} = useContext(Context);
    const [name,setName] = useState("");
    const [list,setList] = useState([]);
    const [contactsChannel,setContactsChannel] = useState([]);
    const styles = useTheme();
    const navigate = useNavigate();


    async function onSubmit(e){
        e.preventDefault();
        try{
            const users = contactsChannel.map((user) => user.id);
            const {data: u} = await axios.post(`http://localhost:3001/users/${user.id}/channels`,{
                name: name,
                users: [...users]
            },
            {
              headers: {
                Authorization: `Bearer ${oauth.access_token}`,
              },
            });
            setUser(u)
            navigate(`/channels/${u.channels.at(-1)}`);
        }
        catch(error)
        {
            alert(error)
        }
    }

    function addUserToTheChannel(user){
        try{
            if(contactsChannel.some(u => u.id.match(user.id)))
                throw new Error("User allready added");
            setContactsChannel([...contactsChannel,user]);
            list.splice(list.findIndex(u=>u.id.match(user.id)),1)
            setList([...list])
        }
        catch(error)
        {
            alert(error.message);
        }
    }

    function handleChange(e) {
        setName(e.target.value);
    }

    function removeFromChannel(user){
        try{
            if(!contactsChannel.some(u => u.id.match(user.id)))
                throw new Error("User is not added");
            setList([...list,user]);
            contactsChannel.splice(contactsChannel.findIndex(u=>u.id.match(user.id)),1);
            setContactsChannel([...contactsChannel]);
            
        }
        catch(error)
        {
            alert(error.message);
        }
    }

    useEffect(async ()=>{

        try{
            const {data: contacts} = await axios.get(`http://localhost:3001/users/${user.id}/contacts`,
            {
              headers: {
                Authorization: `Bearer ${oauth.access_token}`,
              },
            })
            setList(contacts);
        }
        catch(error)
        {
            console.log(error)
            setList([]);
        }

    },[]);

    return (
    <Box id="createChannel">
        <Typography>Create a new Channel</Typography>
        <Box>
            <TextField label="Name Channel" onChange={handleChange} value={name} />
            <Box>
                <Box>
                    {/* List of contact not added */}
                    {list.map(contact => {
                        return (
                            <Box>
                                <Typography id="outlined-read-only-input" disabled>
                                    {/* Insert image */}
                                    {contact.username}
                                </Typography>
                                <Fab size="small" onClick={(e)=>{
                                    e.preventDefault();
                                    addUserToTheChannel(contact);
                                }} ><AddIcon/></Fab>
                            </Box>
                        )
                    })}
                </Box>
                <Box>
                    {/* List of contact added */}
                    {contactsChannel.map(contact => {

                        return (
                            <Box>
                                <Typography id="outlined-read-only-input" disabled>
                                    {/* Insert image */}
                                    {contact.username}
                                </Typography>
                                <Fab size="small" onClick={(e)=>{
                                    e.preventDefault();
                                    removeFromChannel(contact);
                                }} ><CancelIcon/></Fab>
                            </Box>

                        )
                    })}
                </Box>
            </Box>
            
            <Button variant="contained" onClick={onSubmit} endIcon={<CreateIcon />}>Create</Button>
        </Box>

    </Box>)



}