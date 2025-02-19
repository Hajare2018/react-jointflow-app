import { AppBar, Dialog, Toolbar, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../Loader';
import CrmTable from './CrmTable';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogPaper: {
    position: 'absolute',
    right: 0,
    height: '100%',
  },
}));

function CrmComponent({ open, handleClose }) {
  const loader = useSelector((state) => state.showLoader);
  const classes = useStyles();
  return loader.show ? (
    <Loader />
  ) : (
    <Dialog
      maxWidth="lg"
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>Choose A Deal</strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <CrmTable />
    </Dialog>
  );
}

export default React.memo(CrmComponent);
