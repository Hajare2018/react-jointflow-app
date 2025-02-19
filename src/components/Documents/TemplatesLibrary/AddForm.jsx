import { AppBar, Dialog, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import React from 'react';
import EditForm from './EditForm';

const useStyles = makeStyles((_theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
}));

function AddForm({ open, handleclose }) {
  const classes = useStyles();
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>Add Template</strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleclose}
            aria-label="close"
          >
            <Close style={{ fontSize: 30 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <EditForm close={handleclose} />
    </Dialog>
  );
}

export default React.memo(AddForm);
