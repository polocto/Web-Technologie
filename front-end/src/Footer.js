
/** @jsxImportSource @emotion/react */
import { useTheme } from '@mui/styles';


const useStyles = (theme) => ({
  footer: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.dark,
    flexShrink: 0,
  },
})

export default function Footer() {
  const styles = useStyles(useTheme());
  return (<span style={styles}></span>);
}
