import React from 'react'
import Messages from '../Messages/Messages'
import MessageForm from '../Messages/MessageForm'
import { styles } from '../App'

export default function Channel(props){
    return (
        <div style={styles.channel} class="channel">
            <h1>Messages for {props.channel.name}</h1>
          <div style={styles.messages} class="messages">
            <ul>
              <Messages messages={props.messages}/>
            </ul>
          </div>
          <MessageForm addMessage={props.addMessage} />
        </div>
    )
}