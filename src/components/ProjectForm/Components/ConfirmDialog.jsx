import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import * as React from 'react';

function ConfirmDialog({ open, handleClose, dialogTitle, dialogContent }) {
  return (
    <Dialog
      onEscapeKeyDown={handleClose}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>
        <div className="d-flex justify-space-between">
          <strong>{dialogTitle}</strong>
          <button onClick={handleClose}>
            <CloseOutlined />
          </button>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText color="#222222">{dialogContent}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => handleClose({ close: true })}>Yes</Button>
        <Button onClick={handleClose}>No</Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(ConfirmDialog);
