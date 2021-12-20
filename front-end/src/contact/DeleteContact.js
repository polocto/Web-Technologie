import { useContext } from "react";
import Context from "../Context";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import { Fab } from "@mui/material";
import config from "../config";


export default function DeleteContact({contact}){
    const {user, setUser, oauth} = useContext(Context)
    async function handleClick(){

        try
        {
            const {data: temp} = await axios.delete(`http://localhost:${config.port}/users/${user.id}/contacts/${contact.id}`,
            {
              headers: {
                Authorization: `Bearer ${oauth.access_token}`,
              },
            });
            setUser({...temp})
        }
        catch(error)
        {
            console.log(error);
        }
    }
    return (
        <Fab size="small" onClick={(e)=>{
            e.preventDefault();
            handleClick();
        }} ><CancelIcon/></Fab>
    )
}