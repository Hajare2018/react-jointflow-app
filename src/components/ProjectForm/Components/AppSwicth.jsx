import { FormControlLabel, Switch } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';

export default function AppSwitch({ switchLabel, switchedName, switchedValue, handleSwitch }) {
  const IOSSwitch = withStyles((theme) => ({
    root: {
      width: 36,
      height: 20,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#3edab7',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#3edab7',
        border: '6px solid #fff',
      },
    },
    thumb: {
      marginTop: 2,
      width: 14,
      height: 14,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: '#cccccc',
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }))(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });
  return (
    <FormControlLabel
      control={
        <IOSSwitch
          checked={switchedValue}
          onChange={handleSwitch}
          name={switchedName}
        />
      }
      label={<span style={{ fontWeight: '600' }}>{switchLabel}</span>}
    />
  );
}
