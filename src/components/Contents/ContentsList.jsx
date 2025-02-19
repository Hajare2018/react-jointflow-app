import { Dialog } from '@mui/material';
import React from 'react';
import ContentTemplates from './ContentTemplates';

function ContentsList({ open, handleClose }) {
  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      open={open}
      onClose={handleClose}
    >
      <ContentTemplates
        clone
        close={handleClose}
      />
    </Dialog>
  );
}

export default React.memo(ContentsList);
