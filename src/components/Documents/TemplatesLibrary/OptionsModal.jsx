import { Button, Dialog, DialogActions, IconButton } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { displayDialog } from '../../../Redux/Actions/loader';
import { Close } from '@mui/icons-material';

function OptionsModal({ open, task_type_name, handleYes }) {
  const dispatch = useDispatch();
  const closePrompt = () => {
    dispatch(displayDialog(false));
  };
  const goNext = () => {
    handleYes({ yes: true });
  };

  return (
    <Dialog
      maxWidth="md"
      open={open}
    >
      <div className="d-flex justify-space-between">
        <strong className="ml-5">Import Task Type Details</strong>
        <IconButton onClick={closePrompt}>
          <Close style={{ color: '#000000' }} />
        </IconButton>
      </div>
      <div className="d-flex-column p-5">
        <p>
          Do you want to replace all Steps, Documents and Settings from the template{' '}
          <strong>{task_type_name}</strong>
        </p>
      </div>
      <DialogActions>
        <Button
          variant="contained"
          onClick={goNext}
          style={{
            backgroundColor: '#6385b7',
            color: '#ffffff',
            fontSize: 16,
          }}
        >
          Yes
        </Button>
        <Button
          variant="contained"
          onClick={closePrompt}
          style={{
            backgroundColor: '#ffffff',
            color: '#6385b7',
            fontSize: 16,
          }}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(OptionsModal);
