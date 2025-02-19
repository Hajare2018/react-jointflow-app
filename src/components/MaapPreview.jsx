import { Dialog } from '@mui/material';
import React from 'react';

function MaapPreview({ open, handleClose, url }) {
  return (
    <Dialog
      maxWidth="xl"
      fullWidth
      open={open}
      onClose={handleClose}
    >
      <div style={{ height: '130vh' }}>
        <iframe
          height={'100%'}
          width={'100%'}
          src={url}
        />
      </div>
    </Dialog>
  );
}

export default React.memo(MaapPreview);
