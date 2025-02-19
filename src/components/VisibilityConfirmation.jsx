import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

function VisibilityConfirmation({ open, handleClose, buyerCompany }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Visibility Confirmation</DialogTitle>
      <DialogContent>
        Do you confirm you want to make this internal task visible to external contacts from
        {buyerCompany}
      </DialogContent>
      <DialogActions>
        <Button variant="text">No</Button>
        <Button variant="contained">Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

export default VisibilityConfirmation();
