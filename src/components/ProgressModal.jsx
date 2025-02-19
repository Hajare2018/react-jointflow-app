import * as React from 'react';
import { Modal, Box } from '@mui/material';
import LinearProgressModal from './LinearProgressModal';

const style = {
  position: 'absolute',
  padding: 20,
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  textAlign: 'center',
  backgroundColor: '#ffffff',
  border: '2px solid #627daf',
  boxShadow: 24,
  p: 4,
};

export default function ProgressModal({ open, handleClose }) {
  return (
    <React.Fragment>
      <Modal
        open={open}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box style={style}>
          <LinearProgressModal close={handleClose} />
        </Box>
      </Modal>
    </React.Fragment>
  );
}
