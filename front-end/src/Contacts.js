import { Tabs, Tab } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Context from "./Context";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/system";
import axios from "axios";
import Contact from "./contact/Contact";
import Pending from "./contact/Pending";
import AddContact from "./contact/AddContact";


export default function Contacts(){
    const {user, oauth} = useContext(Context);
    const [menu, setMenu]=useState('');
    const [contacts,setContact] = useState([])

    const theme = useTheme();

    useEffect(async ()=>{

        try{
            const {data: temp} = await axios.get(`http://localhost:3001/users/${user.id}/contacts/${menu}`,
            {
              headers: {
                Authorization: `Bearer ${oauth.access_token}`,
              },
            })
            setContact([...temp]);
        }
        catch(error)
        {
            console.log(error)
        }

    },[user,menu])
    function handleChange(event,newValue){
        setMenu(newValue);
    }

    return(
        <Box> 
            <Tabs value={menu} onChange={handleChange} >
                <Tab value="" label="Contact" />
                <Tab value="pending"  label="Pending Invitations" />
                <Tab value="sent" label="Sent Invitation" />
                <Tab value="new" label="Add new contect"/>
            </Tabs>
            {menu.match("new") ?  (<AddContact/>) : contacts.map(contact=>{
                        switch(menu)
                        {
                            case "pending":
                                return (<Pending contact={contact}/>);
                            default:
                                return (<Contact contact={contact}></Contact>)
                        }
                    })
                }
        </Box>
    )

}