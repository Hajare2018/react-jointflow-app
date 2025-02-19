import React from 'react';
import { LinearProgress, Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';

const DangerLinearProgress = withStyles(() => ({
  root: {
    height: 20,
    borderRadius: 5,
    width: 80,
  },
  colorPrimary: {
    backgroundColor: '#fdbab8',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#fc8c8a',
  },
}))(LinearProgress);

const WarningLinearProgress = withStyles(() => ({
  root: {
    height: 20,
    borderRadius: 5,
    width: 80,
  },
  colorPrimary: {
    backgroundColor: '#ffc966',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#FFA500',
  },
}))(LinearProgress);

const SuccessLinearProgress = withStyles(() => ({
  root: {
    height: 20,
    borderRadius: 5,
    width: 80,
  },
  colorPrimary: {
    backgroundColor: '#8be8d3',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#3edab7',
  },
}))(LinearProgress);

const AlertLinearProgress = withStyles(() => ({
  root: {
    height: 20,
    borderRadius: 5,
    width: 80,
  },
  colorPrimary: {
    backgroundColor: '#f3b183',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#ec7d31',
  },
}))(LinearProgress);

function AppProgressbar({ value, forBoards, forLightUser }) {
  return forBoards ? (
    value >= 0 && value < 40 ? (
      <DangerLinearProgress
        variant="determinate"
        value={value}
      />
    ) : value >= 40 && value < 80 ? (
      <WarningLinearProgress
        variant="determinate"
        value={value}
      />
    ) : value >= 80 ? (
      <SuccessLinearProgress
        variant="determinate"
        value={value}
      />
    ) : (
      ''
    )
  ) : forLightUser ? (
    value >= 0 && value < 35 ? (
      <Tooltip
        title={value + '% completed'}
        placement="top"
      >
        <WarningLinearProgress
          variant="determinate"
          value={value}
        />
      </Tooltip>
    ) : value >= 35 && value < 70 ? (
      <Tooltip
        title={value + '% completed'}
        placement="top"
      >
        <AlertLinearProgress
          variant="determinate"
          value={value}
        />
      </Tooltip>
    ) : value >= 70 && value < 100 ? (
      <Tooltip
        title={value + '% completed'}
        placement="top"
      >
        <DangerLinearProgress
          variant="determinate"
          value={value}
        />
      </Tooltip>
    ) : value >= 0 && value < 35 ? (
      <Tooltip
        title="Low"
        placement="top"
      >
        <WarningLinearProgress
          variant="determinate"
          value={value}
        />
      </Tooltip>
    ) : (
      ''
    )
  ) : value >= 35 && value < 70 ? (
    <Tooltip
      title="Medium"
      placement="top"
    >
      <AlertLinearProgress
        variant="determinate"
        value={value}
      />
    </Tooltip>
  ) : value >= 70 && value < 100 ? (
    <Tooltip
      title="High"
      placement="top"
    >
      <DangerLinearProgress
        variant="determinate"
        value={value}
      />
    </Tooltip>
  ) : (
    ''
  );
}

export default React.memo(AppProgressbar);
