import { useTheme } from "@emotion/react";
import { TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useContext, useState } from "react";
import Context from "../Context";



export default function AddContact(){

    const {user, setUser, oauth} = useContext(Context);
    const [email, setEmail] = useState('');
    const styles = useTheme

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleClick = async ()=>{
        try{
            const {data: temp} = await axios.post(`http://localhost:3001/users/${user.id}/contacts/${email}`,user,
            {
              headers: {
                Authorization: `Bearer ${oauth.access_token}`,
              },
            });
            setEmail('');
            setUser({...temp});
        }
        catch(error){
            setEmail('');
            console.log(error);

        }
    }

    return (
        <Box>
            <Typography>Add User</Typography>
            <form css={styles.form} onSubmit={(e)=>{e.preventDefault(); handleClick();}} >
            <TextField variant="filled" label="@email" value={email} onChange={handleChange}  />
            </form>

        </Box>
    )
}