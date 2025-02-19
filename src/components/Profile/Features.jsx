import { Avatar, IconButton } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import React from 'react';
import Feedback from './Feedback';

export default function Features({
  withFeedback,
  featureIcon,
  title,
  notes,
  handleFeature,
  background,
}) {
  return (
    <div className="password-class">
      <span>
        <Avatar style={{ backgroundColor: background, height: 70, width: 70 }}>
          {featureIcon}
        </Avatar>
      </span>
      <h2>
        {title}
        <span>{notes}</span>
      </h2>
      {withFeedback && <Feedback />}
      <span>
        <IconButton onClick={handleFeature}>
          <ArrowForwardIos style={{ fontSize: 35, color: '#627daf' }} />
        </IconButton>
      </span>
    </div>
  );
}
