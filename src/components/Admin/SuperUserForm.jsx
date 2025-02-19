import { AppBar, Dialog, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import React from 'react';
import SuperUserPage from '../../pages/SuperUserPage';

const useStyles = makeStyles((_theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
}));

function SuperUserForm({ open, handleClose, schemaName }) {
  const classes = useStyles();
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>Create New Super User</strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close style={{ fontSize: 30 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SuperUserPage
        forAdmin
        schema={schemaName}
        close={handleClose}
      />
    </Dialog>
  );
}

export default React.memo(SuperUserForm);
