import { Button, Dialog, DialogActions } from '@mui/material';
import React from 'react';
import AppButton from './Components/AppButton';
import { useSelector } from 'react-redux';

function MaapLinkModal({ assignee, open, handleClose }) {
  const loader = useSelector((state) => state.showLoader);
  const linkData = useSelector((state) => state.copyMaapLinkData);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(linkData.data.url);
    if (!loader.show) {
      handleClose();
    }
  };
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      onClose={handleClose}
    >
      <div className="p-8">
        <div className="p-4 bg-white rounded-md shadow-lg max-w-md w-full">
          <h2 className="text-lg font-semibold mb-4">
            This link is unique to {assignee}. Do not send to anyone else.
          </h2>
          <p className="text-sm break-words">{linkData.data.url}</p>
        </div>
      </div>
      <DialogActions>
        <Button
          variant="text"
          onClick={handleClose}
        >
          Close
        </Button>
        <AppButton
          onClick={handleCopyLink}
          contained
          buttonText={'Copy'}
        />
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(MaapLinkModal);
