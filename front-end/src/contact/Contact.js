import {  Typography } from "@mui/material";
import { Box } from "@mui/system";
import DeleteContact from "./DeleteContact";




export default function Contact({contact}){
    

    return (<Box>
        <Typography id="outlined-read-only-input" disabled>
            {/* Insert image */}
            {contact.username}
        </Typography>
        <DeleteContact contact={contact} ></DeleteContact>
    </Box> );
}