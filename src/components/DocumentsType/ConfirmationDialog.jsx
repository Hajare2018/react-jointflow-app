import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { putDocumentsType } from '../../Redux/Actions/documents-type';
import { show } from '../../Redux/Actions/loader';

export default function ConfirmationDialog({ open, handleClose, archiveData, archive }) {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const archiveType = () => {
    dispatch(show(true));
    dispatch(
      putDocumentsType({
        active: archive ? 'True' : 'False',
        normalised_label: archiveData?.normalised_label,
        custom_label: archiveData?.custom_label,
        company: 1,
        id: archiveData?.id,
        color: archiveData?.color,
        applies_to: archiveData?.applies_to,
        is_legal: archiveData?.is_legal,
      }),
    );
    if (!loader.show) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        {archive ? 'Are you sure to unarchive this entry?' : 'Are you sure to archive this entry?'}
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
        >
          NO
        </Button>
        <Button
          onClick={archiveType}
          color="primary"
        >
          YES
        </Button>
      </DialogActions>
    </Dialog>
  );
}
