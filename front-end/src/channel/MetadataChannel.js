import { TextField } from "@mui/material"
import { Box } from "@mui/system"
import axios from "axios";
import { useContext, useState } from "react";
import config from "../config";
import Context from "../Context";
import { Button } from "@mui/material";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";


export default function MetadataChannel({setChannel, channel}){
    const {user,oauth, setUser} = useContext(Context);
    const [modifiable, setModifiable] = useState(false)
    const [name,setName] = useState(channel.name)

    function onChange(e){
        setName(e.target.value)
    }

    async function onModification() {
        if (modifiable) {
           const {data: chan} = await axios.put(
            `http://localhost:${config.port}/users/${user.id}/channels/${channel.id}`,
            {
              name: name,
            },
            {
              headers: {
                Authorization: `Bearer ${oauth.access_token}`,
              },
            }
          );
          setChannel({...chan});
        }
        setModifiable(!modifiable);
      }

    return(<Box>
        <Button
        onClick={(e) => {
            e.preventDefault()
          onModification();
        }}
      >
        <ModeEditOutlineRoundedIcon fontSize="small" />
      </Button>
        <TextField disabled={!modifiable} value={name} onChange={onChange} ></TextField>
    </Box>)
}