import { makeStyles } from '@mui/styles';

const drawerWidth = 185;

export default makeStyles((theme) => ({
  menuButton: {
    margin: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },

  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#ffffff',
    marginTop: '80px',
  },
}));
