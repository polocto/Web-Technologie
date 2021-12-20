import { Fab, Typography } from "@mui/material";
import { Box } from "@mui/system";
import AcceptInvitation from "./AcceptInvitation";
import DeleteContact from "./DeleteContact";




export default function Pending({contact}){
    

    return (<Box>
        <Typography id="outlined-read-only-input" disabled>
            {/* Insert image */}
            {contact.username}
        </Typography>
        <AcceptInvitation contact={contact}/>
        <DeleteContact contact={contact} />
    </Box> );
}