import React, { useEffect, useState } from 'react';
import AppSwitch from './Components/AppSwicth';
import { Grid, Tooltip } from '@mui/material';
import Comments from '../CommentWindow/Comments';
import AppButton from './Components/AppButton';
import { CheckCircleOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import './TaskInfo.css';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../Redux/Actions/loader';
import editTaskData from '../../Redux/Actions/update-task-info';
import { useUserContext } from '../../context/UserContext';

function Timelines({ cardData, toClose, visibleToClient }) {
  const [comments, setComments] = useState(true);
  const [events, setEvents] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { user } = useUserContext();
  const singleTask = useSelector((state) => state.singleCardData);
  const singleTaskData = singleTask?.data?.length > 0 ? singleTask?.data[0] : [];
  useEffect(() => {}, [singleTaskData]);

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  // TODO FIXME this seems incorrect
  const handleComments = (_event) => {
    setComments(!comments);
  };

  const handleEvents = (_event) => {
    setEvents(!events);
  };

  const handleCompleted = () => {
    dispatch(show(true));
    dispatch(
      editTaskData({
        id: singleTaskData?.id,
        title: singleTaskData?.title,
        start_date: singleTaskData?.start_date,
        end_date: singleTaskData?.end_date,
        description: singleTaskData?.description,
        board: singleTaskData?.board,
        owner: singleTaskData?.owner_details?.id,
        color: singleTaskData?.task_type_details?.color,
        is_completed: singleTaskData?.is_completed ? 'False' : 'True',
        last_updated_type: 'Task Approved',
        document_type: singleTaskData?.task_type_details?.id,
        fetchAll: cardData?.from_widget,
        fetchByType: cardData?.byType,
        type: cardData?.byType && singleTaskData?.task_type_details?.custom_label,
        filteredTasks: {
          allCards: cardData?.my_task?.allCards,
          completed: cardData?.my_task?.completed,
          upcoming: cardData?.my_task?.upcoming,
        },
        legalTasks: {
          isLegal: cardData?.is_legal?.isLegal,
          isLegal__completed: cardData?.is_legal?.isLegal?.isLegal__completed,
          isLegal__upcoming: cardData?.is_legal?.isLegal?.isLegal__upcoming,
        },
        userId: user.id,
      }),
    );
  };

  const handleClose = () => {
    toClose();
  };
  const path = window.location.href;
  const isUrlIncludesTasks = path.includes('tasks');

  let isDisabled = false;
  if (singleTaskData?.task_timing === 'Strictly_Sequential') {
    if (!singleTaskData?.ref_task_is_completed) {
      isDisabled = true;
    } else {
      isDisabled = false;
    }
  }

  return (
    <div className="taskWrap">
      <div className="inner-div">
        <div className="timelineWrap">
          <AppSwitch
            switchLabel="Comments"
            switchedValue={comments}
            handleSwitch={handleComments}
            switchedName={'comments'}
          />
          <AppSwitch
            switchLabel="Events"
            switchedValue={events}
            handleSwitch={handleEvents}
            switchedName={'events'}
          />
          <div onClick={toggleVisibility}>
            <Tooltip
              title={visible ? 'Hide buyers comments' : 'Show buyers comments'}
              arrow
              placement="bottom-end"
            >
              {visible ? (
                <Visibility className="text-[#3edab7]" />
              ) : (
                <VisibilityOff className="text-[#999]" />
              )}
            </Tooltip>
          </div>
        </div>
        <Comments
          timelineComments={comments}
          taskData={{
            taskId: cardData?.taskId == undefined ? singleTaskData?.id : cardData?.taskId,
          }}
          clientVisible={visibleToClient}
          buyersComment={visible}
          events={events}
        />
      </div>
      <div className="footerBar">
        <Grid
          container
          direction="row"
        >
          <Grid
            item
            xs={12}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {!isUrlIncludesTasks && (
              <AppButton
                greyButton
                onClick={handleClose}
                buttonText={'Cancel'}
              />
            )}
            <div className="ml-3">
              <AppButton
                contained={!isDisabled}
                greyButton={isDisabled}
                disabled={isDisabled}
                buttonIcon={<CheckCircleOutlined />}
                buttonText={singleTaskData?.is_completed ? 'Re-open task' : 'Mark as Complete'}
                tooltip={
                  isDisabled ? 'Previous task must be completed first' : 'Mark this task complete'
                }
                onClick={handleCompleted}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Timelines;
