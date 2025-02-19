import React from 'react';
import { makeStyles } from '@mui/styles';
import { createImageFromInitials } from './Utils';
import { Avatar, CircularProgress, Tooltip } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

function Menu({ user_name, role, profile_pic }) {
  const classes = useStyles();
  const doNavigate = (to) => {
    window.open(to, '_self');
  };
  const profilePic = profile_pic ? profile_pic : createImageFromInitials(300, user_name, '#627daf');
  return (
    <div className={classes.root}>
      <div className="tour-profile d-flex">
        <div className="d-flex-row">
          <Tooltip
            title={user_name + '(' + role + ')'}
            placement={'bottom'}
            arrow
          >
            {profilePic ? (
              <Avatar>
                <img
                  onClick={() => doNavigate('/profile')}
                  src={profilePic}
                  className="img-lazy-avatar"
                  loading="lazy"
                  alt={<CircularProgress />}
                />
              </Avatar>
            ) : (
              <CircularProgress style={{ height: 25, width: 25, color: '#627daf' }} />
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Menu);
