import { AppBar, Dialog, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddTasksModal from '../AddTasksModal';
import AdditionalTableTabs from './AdditionalTableTabs';
import requestSingleProject from '../../../../Redux/Actions/single-project';

const useStyles = makeStyles((_theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
}));

function TaskForm({ open, handleClose, forAdd }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const singleTask = useSelector((state) => state.singleCardData);
  const keep_data = useSelector((state) => state.keepThis);
  const singleTaskData = singleTask?.data?.length > 0 ? singleTask?.data?.[0] : [];
  const board = useSelector((state) => state.singleProjectData);
  const closeModal = () => {
    dispatch(requestSingleProject({ id: board?.data?.[0]?.id }));
    handleClose();
  };
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>
            {singleTask?.data?.length > 0 && keep_data?.show
              ? `Edit task "${singleTaskData?.title}" for template "${singleTaskData?.board_name}"`
              : `Add task for template "${board?.data?.[0]?.name}"`}
          </strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={closeModal}
            aria-label="close"
          >
            <Close style={{ fontSize: 30 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      {!forAdd?.length && !keep_data.show ? (
        <AddTasksModal
          handleClose={handleClose}
          forAdd={forAdd}
        />
      ) : (
        <AdditionalTableTabs
          close={handleClose}
          forAdd={forAdd}
        />
      )}
    </Dialog>
  );
}

export default React.memo(TaskForm);
