import React from 'react'
import { styles } from '../App'


export default function Messages(props){
    return (
        props.messages.map( (message, i) => (
            <li key={i} css={styles.message}>
              <p>
                <span>{message.author}</span>
                {' '}
                <span>{new Intl.DateTimeFormat('fr-FR', {dateStyle:'medium', timeStyle:'short'}).format(new Date(message.creation))/*.format("ddd, hA").toString()*/}</span>
              </p>
              <div>
                {
                  message.content
                  .split(/(\n +\n)/)
                  .filter( el => el.trim() )
                  .map( el => <p>{el}</p>)
                }
              </div>
            </li>
          ))
    )
}