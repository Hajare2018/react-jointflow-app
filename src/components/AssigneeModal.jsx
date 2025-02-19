import { Avatar, CircularProgress, Popover, Tooltip } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import React from 'react';
import { createImageFromInitials } from './Utils';
import { useSelector } from 'react-redux';

const styles = {
  scrollContainer: {
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
    maxWidth: '18vw',
    padding: '10px',
  },
  scrollContent: {
    display: 'inline-flex',
  },
};

const useStyles = makeStyles(() => ({
  avatar: {
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.75)',
    },
  },
}));

const StyledTooltip = withStyles(() => ({
  tooltip: {
    maxWidth: 'none',
  },
}))(Tooltip);

function AssigneeModal({ assignee_team, id, show, anchor, handleClose }) {
  const classes = useStyles();
  const loader = useSelector((state) => state.promptData);
  return (
    <Popover
      id={id}
      open={show}
      anchorEl={anchor}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <div style={styles.scrollContainer}>
        {loader.show ? (
          <CircularProgress />
        ) : (
          <div style={styles.scrollContent}>
            {assignee_team?.map((img) => (
              // TODO fixme
              // eslint-disable-next-line react/jsx-key
              <StyledTooltip
                classes={classes.noMaxWidth}
                title={
                  <div className="d-flex-column justify-centre">
                    <Avatar
                      className={classes.avatar}
                      src={
                        (img?.avatar === null || img?.avatar?.split('/')?.[4] == 'undefined') &&
                        img?.first_name !== 'undefined'
                          ? createImageFromInitials(
                              200,
                              img?.first_name + ' ' + img?.last_name,
                              '#6385b7',
                            )
                          : img?.first_name == 'undefined'
                            ? ''
                            : img?.avatar
                      }
                      style={{
                        height: 150,
                        width: 150,
                        marginBottom: 10,
                      }}
                    />
                    <div className="p-1">
                      <h4>
                        <strong>Name:</strong> {img?.first_name + img?.last_name}
                      </h4>
                      <h4>
                        <strong>Email:</strong> {img?.email}
                      </h4>
                      <h4>
                        <strong>Phone:</strong>
                        {img?.phone_number === 'false' ||
                        img?.phone_number === '' ||
                        img?.phone_number == 'undefined'
                          ? 'Unknown'
                          : img?.phone_number}
                      </h4>
                    </div>
                  </div>
                }
                placement="bottom"
                arrow
              >
                <Avatar
                  className={classes.avatar}
                  src={
                    img?.avatar === null
                      ? createImageFromInitials(
                          200,
                          img?.first_name + ' ' + img?.last_name,
                          '#627daf',
                        )
                      : img?.avatar
                  }
                  style={{ height: 35, width: 35, margin: 5 }}
                />
              </StyledTooltip>
            ))}
          </div>
        )}
      </div>
    </Popover>
  );
}

export default React.memo(AssigneeModal);
