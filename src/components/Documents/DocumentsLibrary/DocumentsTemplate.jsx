import { AppBar, Dialog, Toolbar, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import React from 'react';
import DocumentLibrary from './DocumentLibrary';

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

function DocumentsTemplate({ open, handleClose, card, forTaskTypes }) {
  const classes = useStyles();
  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>Select a document to copy and attach to this task</strong>
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
      <DocumentLibrary
        clone={open}
        card_id={card}
        closeModal={handleClose}
        forTaskTypes={forTaskTypes}
      />
    </Dialog>
  );
}

export default React.memo(DocumentsTemplate);
