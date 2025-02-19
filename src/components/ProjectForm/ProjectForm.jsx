import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import FormTabs from './FormTabs';
import { useDispatch, useSelector } from 'react-redux';
import { handleTabsChange } from '../../Redux/Actions/tab-values';
import { reload } from '../../Redux/Actions/reload-data';
import { Link } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import getSingleTask from '../../Redux/Actions/single-task';
import { requestTaskSteps } from '../../Redux/Actions/task-info';
import { getAllUsers } from '../../Redux/Actions/user-info';
import { getComments } from '../../Redux/Actions/comments';
import Loader from '../Loader';
import { getSingleCardDocs } from '../../Redux/Actions/document-upload';
import { useTenantContext } from '../../context/TenantContext';

const useStyles = makeStyles((theme) => ({
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="left"
      timeout={4000}
      ref={ref}
      {...props}
    />
  );
});

function ProjectForm({ open, handleClose, formData }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const new_card = useSelector((state) => state.reloadedData);
  const singleTask = useSelector((state) => state.singleCardData);
  const singleTaskData = singleTask?.data?.length > 0 ? singleTask?.data[0] : [];
  const [taskLoading, setTaskLoading] = useState(
    Array.isArray(singleTaskData) || formData?.taskId !== singleTaskData.id,
  );
  const [navigationClicked, setNavigationClicked] = useState(false);
  const [taskRequested, setTaskRequested] = useState('');
  const filtered = singleTaskData?.card_list?.filter((card) => card.title !== 'TEST Crash') || [];
  const { activate_steplist } = useTenantContext();

  const handleTaskNavigation = (direction) => {
    setNavigationClicked(true);
    setTaskLoading(true);
    const indexOfCurrentTask = filtered.findIndex((item) => item.id === singleTaskData?.id);
    const taskToLoad =
      direction === 'prev'
        ? filtered[indexOfCurrentTask - 1].id
        : filtered[indexOfCurrentTask + 1].id;
    setTaskRequested(taskToLoad);
    // Get all task related data at once
    dispatch(getAllUsers({ onlyStaff: true }));
    dispatch(getComments({ id: taskToLoad }));
    dispatch(getSingleCardDocs({ doc_id: taskToLoad, archived: false }));
    if (activate_steplist) {
      dispatch(
        requestTaskSteps({
          id: taskToLoad,
          fetchByTaskType: false,
        }),
      );
    }

    // get task last so that other load probably before this one
    dispatch(
      getSingleTask({
        card_id: taskToLoad,
        board_id: singleTaskData?.board,
        task_info: true,
      }),
    );
  };

  const handleClear = () => {
    setNavigationClicked(false);
    setTaskLoading(true);
    dispatch(reload({ add: false }));
    handleClose();
    dispatch(handleTabsChange(0));
  };

  useEffect(() => {
    if (new_card?.data?.add || new_card?.data?.clone) {
      setTaskLoading(false);
    }
    if (navigationClicked) {
      if (taskRequested === singleTaskData.id) {
        setTaskLoading(false);
      }
    } else {
      if (singleTaskData.id === formData?.taskId) {
        setTaskLoading(false);
      }
    }
  }, [singleTaskData, formData, navigationClicked, taskRequested, new_card]);

  const indexOfCurrentTask = filtered.findIndex((item) => item.id === singleTaskData?.id);

  return (
    <Dialog
      className="sidebarDialog"
      fullScreen
      classes={{ paper: classes.dialogPaper }}
      onClose={handleClear}
      open={open}
      TransitionComponent={Transition}
    >
      <AppBar
        className={classes.appBar}
        id="modelHeaderBar"
      >
        <Toolbar className="d-flex justify-space-between">
          {indexOfCurrentTask > 0 ? (
            <Tooltip
              title={'Previous Task'}
              placement="bottom"
            >
              <IconButton onClick={() => handleTaskNavigation('prev')}>
                <ArrowBackIos className="white-color" />
              </IconButton>
            </Tooltip>
          ) : (
            <div />
          )}
          <Tooltip
            title={`Task ID #${singleTaskData?.id}`}
            placement="bottom"
            arrow
          >
            <strong>
              {formData?.show_board && (
                <Link
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  to={`/board/?id=${singleTaskData?.board}&navbars=True&actions=True`}
                >
                  {formData?.board_name}
                </Link>
              )}
              {formData?.show_board && ' /'}
              {new_card?.data?.add ? ' Add New Task' : singleTaskData?.title}
            </strong>
          </Tooltip>
          {indexOfCurrentTask < filtered.length - 1 ? (
            <Tooltip
              title={'Next Task'}
              placement="bottom"
            >
              <IconButton onClick={() => handleTaskNavigation('next')}>
                <ArrowForwardIos className="white-color" />
              </IconButton>
            </Tooltip>
          ) : (
            <div />
          )}
        </Toolbar>
      </AppBar>
      <FormTabs
        onClose={handleClear}
        formData={new_card?.data?.add || new_card?.data?.clone ? formData : singleTaskData}
        fromAdd={new_card?.data?.add}
        isClone={new_card?.data?.clone}
      />
      <div
        style={{
          display: taskLoading ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <Loader />
      </div>
    </Dialog>
  );
}

export default React.memo(ProjectForm);
