import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import Badge from '@mui/material/Badge';

const styles = (theme) => ({
  margin: {
    margin: theme.spacing.unit * 1.68,
  },
  successBadge: {
    backgroundColor: '#627daf',
    color: 'white',
  },
  errorBadge: {
    backgroundColor: 'lightcoral',
    color: 'white',
  },
  warningBadge: {
    backgroundColor: 'orange',
    color: 'white',
  },
  nothingBadge: {
    backgroundColor: '#999',
    color: 'white',
  },
});

function SimpleBadge(props) {
  const { classes, status, content, icon } = props;
  return (
    <div>
      <Badge
        classes={{
          badge:
            status == 'success'
              ? classes.successBadge
              : status == 'error'
                ? classes.errorBadge
                : status == 'warning'
                  ? classes.warningBadge
                  : status == 'nothing'
                    ? ''
                    : '',
        }}
        // className={classes.margin}
        badgeContent={status == 'nothing' ? '' : content}
      >
        {icon}
      </Badge>
    </div>
  );
}

SimpleBadge.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleBadge);
