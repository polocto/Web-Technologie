import { useTheme } from '@emotion/react';
//import { useContext } from 'react';
// Markdown
import { unified } from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'
// Time
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'
//import Context from '../Context'
dayjs.extend(calendar)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  calendar: {
    sameElse: 'DD/MM/YYYY hh:mm A'
  }
})

const useStyles = (theme) => ({
    message: {
    padding: '.2rem .5rem',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,.05)',
    },
  },
});

export default function Message ({key, message}){
    //const {user, oauth} = useContext(Context);
    const styles = useStyles(useTheme);
    const {value} = unified()
            .use(markdown)
            .use(remark2rehype)
            .use(html)
            .processSync(message.content);

    return (<li key={key} styles={styles.message}>
        <p>
        <span>{message.author.username}</span>
        {' - '}
        <span>{dayjs().calendar(message.creation)}</span>
        </p>
        <div dangerouslySetInnerHTML={{__html: value}}>
        </div>
    </li>);
}