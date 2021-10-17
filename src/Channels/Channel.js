import React from 'react'
import Messages from '../Messages/Messages'
import MessageForm from '../Messages/MessageForm'
import { styles } from '../App'

export default function Channel(props){
    return (
        <div css={styles.channel} class="channel">
          <div css={styles.messages} class="messages">
            <h1>Messages for {props.channel.name}</h1>
            <ul>
              <Messages messages={props.messages}/>
            </ul>
          </div>
          <MessageForm addMessage={props.addMessage} />
        </div>
    )
}