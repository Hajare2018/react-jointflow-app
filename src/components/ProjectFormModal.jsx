import { AppBar, Dialog, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import AddProjectForm from './AddProjectForm';
import { Close } from '@mui/icons-material';

const useStyles = makeStyles((_theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
}));

function ProjectFormModal({ open, handleClose, data, forCrm }) {
  const classes = useStyles();
  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={open}
    >
      <AppBar
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar className="justify-space-between">
          <strong>
            {data?.add
              ? 'Add New Project'
              : data?.edit_project
                ? 'Edit Project'
                : data?.template
                  ? 'Create New Template'
                  : data?.edit_template
                    ? 'Edit Project Template'
                    : null}
          </strong>
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
      <AddProjectForm
        data={data}
        forCrm={forCrm}
        tab={0}
        forEdit
      />
    </Dialog>
  );
}

export default React.memo(ProjectFormModal);
