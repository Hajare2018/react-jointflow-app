import { Button, Slide, Snackbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles((_theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      fontSize: 30,
    },
    '& .MuiAlert-icon': {
      fontSize: 40,
    },
  },
  snackbarStyleViaContentProps: {
    backgroundColor: '#627daf',
  },
}));

function SlideTransition(props) {
  return (
    <Slide
      {...props}
      direction="down"
    />
  );
}

function Banner({ open, handleClose, message, vertical, horizontal }) {
  const classes = useStyles();
  return (
    message !== undefined && (
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        ContentProps={{
          'aria-describedby': 'message-id',
          className: classes.snackbarStyleViaContentProps,
        }}
        message={
          <span id="message-id">
            <div>{message}</div>
          </span>
        }
        action={
          <Button
            color="inherit"
            onClick={handleClose}
            size="small"
          >
            OK
          </Button>
        }
        sx={{ bottom: { xs: 90, sm: 0 } }}
      />
    )
  );
}

export default React.memo(Banner);
