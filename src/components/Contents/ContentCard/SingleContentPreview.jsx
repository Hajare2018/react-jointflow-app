import { Dialog } from '@mui/material';
import React from 'react';
import ContentCard from './ContentCard';

function SingleContentPreview({ open, handleClose, content }) {
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
      onClose={handleClose}
    >
      <ContentCard content={content} />
    </Dialog>
  );
}

export default React.memo(SingleContentPreview);
