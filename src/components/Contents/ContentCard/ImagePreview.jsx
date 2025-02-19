import { Dialog, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';
import React from 'react';

function ImagePreview({ image, open, handleClose }) {
  return (
    <Dialog
      maxWidth="xl"
      open={open}
      onClose={handleClose}
    >
      <div style={{ backgroundColor: 'rgba(1, 1, 1, 1)' }}>
        <div className="float-right">
          <IconButton
            type="button"
            onClick={handleClose}
          >
            <Close className="white-color" />
          </IconButton>
        </div>
        <div
          style={{ height: 'auto', width: 'auto' }}
          dangerouslySetInnerHTML={{ __html: image }}
        />
      </div>
    </Dialog>
  );
}

export default React.memo(ImagePreview);
