import { Button, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postComments } from '../../../Redux/Actions/comments';
import editTaskData from '../../../Redux/Actions/update-task-info';
import '../../../App.css';
import { getDevice } from '../../Utils';
import { keepData } from '../../../Redux/Actions/loader';

function Approval({ task, message, isApprove }) {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const isMobile = getDevice();
  const pathname = new URL(window.location.href);
  const board = new URLSearchParams(pathname.search).get('board');

  const handleCompleted = () => {
    dispatch(
      editTaskData({
        id: task?.id,
        board: board,
        is_completed: task?.is_completed ? false : true,
        liteView: true,
      }),
    );
  };

  useEffect(() => {}, [task]);

  const sendMessage = () => {
    dispatch(keepData(false));
    dispatch(
      postComments({
        card: task?.id,
        owner: task?.owner_details?.id,
        comment: message,
        client_facing: 'True',
        created_at: new Date().toISOString(),
        noRefresh: true,
      }),
    );
  };

  const handleApprove = () => {
    if (message === '') {
      handleCompleted();
    } else {
      sendMessage();
      handleCompleted();
    }
  };

  return (
    <div className="d-flex justify-space-between">
      <div className={`${isMobile && 'w-56'}`}>
        {task?.is_completed && (
          <strong>
            This task is approved but you can re-open it by clicking on the button below
          </strong>
        )}
        {/* {!task?.is_completed && message === "" && (
          <strong>Please type in a short message.</strong>
        )} */}
      </div>
      <div style={{ display: 'flex', float: 'right' }}>
        {task?.is_completed && isApprove ? (
          <Button
            variant="contained"
            style={{
              backgroundColor: '#627daf',
              color: '#ffffff',
              textTransform: 'none',
            }}
            className="reopen-btn"
            // disabled={(!task?.is_completed && message === '')}
            onClick={handleApprove}
          >
            {loader.show ? (
              <CircularProgress
                size={20}
                color="#ffffff"
              />
            ) : (
              'Re-open'
            )}
          </Button>
        ) : (
          <Button
            variant="contained"
            style={{
              backgroundColor: '#627daf',
              color: '#ffffff',
              textTransform: 'none',
            }}
            className="approve-btn"
            // disabled={(!task?.is_completed && message === '')}
            onClick={handleApprove}
          >
            {loader.show ? (
              <CircularProgress
                size={20}
                color="#ffffff"
              />
            ) : (
              <p>Approve</p>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default React.memo(Approval);
