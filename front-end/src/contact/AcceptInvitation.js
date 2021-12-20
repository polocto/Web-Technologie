import { useContext } from "react";
import Context from "../Context";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import { Fab } from "@mui/material";


export default function AcceptInvitation({contact}){
    const {user, setUser, oauth} = useContext(Context)
    async function handleClick(){

        try
        {
            const {data: temp} = await axios.post(`http://localhost:3001/users/${user.id}/contacts/${contact.id}`,user,
            {
              headers: {
                Authorization: `Bearer ${oauth.access_token}`,
              },
            });
            setUser({...temp})
        }
        catch(error)
        {
            console.error(error)
        }
    }
    return (
        <Fab size="small" onClick={(e)=>{
            e.preventDefault();
            handleClick();
        }} ><AddIcon/></Fab>
    )
}