import { IconButton, Tooltip } from '@mui/material';
import { ThumbDownAlt, ThumbUpAlt } from '@mui/icons-material';
import React from 'react';
import { useDispatch } from 'react-redux';
import giveFeedback from '../../Redux/Actions/feedback';

export default function Feedback() {
  const dispatch = useDispatch();
  const handleFeedback = (sentiments, comment) => {
    const reqBody = {
      topic: 'Multi Factor Authentication',
      comment: comment,
      sentiment: sentiments,
    };
    dispatch(giveFeedback(reqBody));
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Tooltip
        title="Don't care!"
        placement="bottom"
        arrow
      >
        <IconButton onClick={() => handleFeedback('negative', "Don't care!")}>
          <ThumbDownAlt style={{ height: 35, width: 35, color: 'rgb(98, 125, 175)' }} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Bring it faster!"
        placement="top"
        arrow
      >
        <IconButton onClick={() => handleFeedback('positive', 'Bring it faster!')}>
          <ThumbUpAlt style={{ height: 35, width: 35, color: 'rgb(98, 125, 175)' }} />
        </IconButton>
      </Tooltip>
    </div>
  );
}
