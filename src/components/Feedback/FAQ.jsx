import { makeStyles } from '@mui/styles';
import { LaunchOutlined, Star, TrackChangesOutlined } from '@mui/icons-material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

function FAQ({ data }) {
  const classes = useStyles();
  return (
    <Timeline>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot
            style={{ color: '#627daf', border: 'none' }}
            variant="outlined"
          >
            <TrackChangesOutlined style={{ width: 50, height: 50 }} />
          </TimelineDot>
          <TimelineConnector className={classes.secondaryTail} />
        </TimelineSeparator>
        <TimelineContent>
          <div className="d-flex justify-content-between">
            <strong>{data.name}</strong>
            {data.important && <Star style={{ color: '#627daf' }} />}
          </div>
          <p>
            {data.text_content}
            <a
              href={data.link_url}
              target="_blank"
              rel="noreferrer"
            >
              <LaunchOutlined style={{ color: '#627daf' }} />
            </a>
          </p>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}

export default React.memo(FAQ);
