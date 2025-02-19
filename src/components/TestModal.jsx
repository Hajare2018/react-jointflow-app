import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { FaApple, FaYahoo } from 'react-icons/fa';
import GoogleCalendar from '../assets/icons/google-calendar.png';
import Outlook from '../assets/icons/outlook.png';
import Office365 from '../assets/icons/office365.png';
import { useDispatch, useSelector } from 'react-redux';
import editTaskData from '../Redux/Actions/update-task-info';

export default function TestModal({ children }) {
  const dispatch = useDispatch();
  const singleTask = useSelector((state) => state.singleCardData);
  const singleTaskData = singleTask?.data?.length > 0 ? singleTask?.data[0] : [];
  const doEditTask = () => {
    dispatch(
      editTaskData({
        id: singleTaskData?.id,
        board: singleTaskData?.board,
        fetchByType: true,
        last_update_type: 'Calendar time scheduled',
      }),
    );
  };
  return (
    <div>
      <List component="div">
        {children.map((item) => (
          <ListItem
            className="d-flex"
            key={item.key}
          >
            <ListItemIcon>
              {item.key === 'Google' ? (
                <img
                  src={GoogleCalendar}
                  style={{ width: 30, height: 30 }}
                />
              ) : item.key === 'Outlook' ? (
                <img
                  src={Outlook}
                  style={{ width: 30, height: 30 }}
                />
              ) : item.key === 'Office365' ? (
                <img
                  src={Office365}
                  style={{ width: 30, height: 30 }}
                />
              ) : item.key === 'iCal' ? (
                <FaApple style={{ fontSize: 35 }} />
              ) : item.key === 'Yahoo' ? (
                <FaYahoo style={{ fontSize: 25, color: 'purple' }} />
              ) : (
                ''
              )}
            </ListItemIcon>
            <ListItemText
              onClick={doEditTask}
              primary={<strong>{item}</strong>}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
