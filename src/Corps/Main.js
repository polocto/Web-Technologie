import React from 'react'
import Channels from '../Channels/Channels'
import Channel from '../Channels/Channel'
import { styles } from '../App'


export default function Main(props){
    return (
        <main className="App-main" style={styles.main}>
            <Channels/>
            <Channel messages={props.messages} channel={props.channel} addMessage={props.addMessage}/>
      </main>
    )
}