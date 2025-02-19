import * as React from 'react';
import { Modal, Box } from '@mui/material';
import { InjectScript } from '../../pages/SupportPage';

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

function TicketModal({ open, handleClose }) {
  const scriptToInject = `
        <script type="text/javascript">
            (function(d, src, c) { var t=d.scripts[d.scripts.length - 1],s=d.createElement('script');s.id='la_x2s6df8d';s.async=true;s.src=src;s.onload=s.onreadystatechange=function(){var rs=this.readyState;if(rs&&(rs!='complete')&&(rs!='loaded')){return;}c(this);};t.parentElement.insertBefore(s,t.nextSibling);})(document, 'https://jointflows.ladesk.com/scripts/track.js', function(e){ LiveAgent.createForm('6a4zicjp', e); }); 
        </script>
    `;

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box style={style}>
          <InjectScript script={scriptToInject} />
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default React.memo(TicketModal);
