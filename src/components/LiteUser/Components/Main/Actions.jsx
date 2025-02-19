import Check from '../../icons/check';
import React, { useEffect, useState } from 'react';
import Comment from '../../icons/comment';
import AppRadioGroup from '../../../AppRadioGroup';
import Approval from '../../LiteUIComponents/Approval';
import CommentForm from '../../LiteUIComponents/CommentForm';
import ReassignForm from '../../LiteUIComponents/ReassignForm';
import { useSelector } from 'react-redux';
import { getDevice } from '../../../Utils';
import { AssignmentIndOutlined } from '@mui/icons-material';

function Actions() {
  const pathname = new URL(window.location.href);
  const tab_id = new URLSearchParams(pathname.search).get('tab');
  const thisTab = tab_id === null ? 1 : tab_id;
  const [tab, setTab] = useState(thisTab);
  const [message, setMessage] = useState('');
  const clearInput = useSelector((state) => state.keepThis);
  useEffect(() => {
    if (!clearInput.show) {
      setMessage('');
    } else {
      setMessage(message);
    }
  }, [clearInput]);
  const handleMessage = (event) => {
    setMessage(event.target.value);
  };
  const tasks = useSelector((state) => state.singleCardData);
  const taskData = tasks?.data?.length > 0 ? tasks?.data?.[0] : [];
  const handleFilters = (id) => {
    setTab(id);
  };
  const isMobile = getDevice();

  const tabFilters = [
    {
      id: 0,
      name: 'Approved',
      icon: <Check className="w-4 text-blue" />,
      active: <Check className="w-4 text-white" />,
      color: '#6385b7',
      class: 'approval',
      display: true,
    },
    {
      id: 1,
      name: 'Respond',
      icon: <Comment className="w-4 text-blue" />,
      active: <Comment className="w-4 text-white" />,
      color: '#6385b7',
      class: 'respond',
      display: true,
    },
    {
      id: 2,
      name: 'Reassign',
      icon: <AssignmentIndOutlined className="w-4 text-blue" />,
      active: <AssignmentIndOutlined className="w-4 text-white" />,
      color: '#6385b7',
      class: 'reassign',
      display: true,
    },
  ];
  return (
    <div>
      <b className="text-lg block mb-1">Actions</b>
      <div style={{ maxWidth: isMobile ? 300 : 366 }}>
        <AppRadioGroup
          filters={tabFilters}
          getFilters={handleFilters}
          endIcon={isMobile ? false : true}
          tabId={thisTab}
          isBackground={true}
        />
      </div>
      <div className="flex flex-col">
        <div className="form-group mt-1 mb-2">
          <strong>Message</strong>
          <textarea
            placeholder="Please type in a short message"
            value={message}
            disabled={taskData?.is_completed}
            style={{ backgroundColor: taskData?.is_completed && '#f7f8fb' }}
            onChange={handleMessage}
            className="text-input-area-md text-message"
            id="message"
            rows="3"
          />
        </div>
        {tab == 0 ? (
          <Approval
            task={taskData}
            message={message}
            isApprove={true}
          />
        ) : tab == 1 ? (
          <CommentForm
            task={taskData}
            comment={message}
          />
        ) : tab == 2 ? (
          <ReassignForm
            task={taskData}
            message={message}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default React.memo(Actions);
