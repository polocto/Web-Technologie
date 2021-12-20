import { TextField, Typography } from "@mui/material";
import { Box } from "@mui/system"


export default function ListUsers({users}){

    
    return (<Box>
        {users.map((user)=>{
            return(<TextField margin="small" size="small" variant="filled" value={user.username}></TextField>)
        })}
    </Box>)
}