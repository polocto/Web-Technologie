import React from 'react'
import { styles } from '../App'
export default function MessageForm(props){
    const onSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        props.addMessage({
          content: data.get('content'),
          author: 'david',
          creation: Date.now()
        });
        e.target.elements.content.value = '';
      } 
      return (
        <form style={styles.form}  onSubmit={onSubmit}>
          <input type="input" name="content" style={styles.content} />
          <input type="submit" value="Send" style={styles.send} />
        </form>
      );
}