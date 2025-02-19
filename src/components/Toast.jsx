import { Fade, Snackbar, Alert } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideSnackbarMessage } from '../Redux/Actions/snackbar';

export default function Toast() {
  const toastProps = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  const handleClose = () => {
    if (toastProps.open) {
      dispatch(hideSnackbarMessage());
    }
  };

  return (
    <>
      <Snackbar
        open={toastProps.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
        key={Fade.name}
      >
        <Alert
          elevation={6}
          onClose={handleClose}
          severity={toastProps.severity}
          variant="filled"
        >
          {toastProps.message}
        </Alert>
      </Snackbar>
    </>
  );
}
