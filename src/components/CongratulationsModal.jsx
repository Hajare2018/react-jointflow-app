import * as React from 'react';
import { Modal, Button, DialogActions, CircularProgress } from '@mui/material';
import trophy from '../assets/images/trophy.gif';
import ConfettiExplosion from 'react-confetti-explosion';

const style = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  position: 'absolute',
  padding: 30,
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  textAlign: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  border: '2px solid #627daf',
  borderRadius: 20,
  boxShadow: 24,
  p: 4,
};

function CongratulationsModal({ open, handleClose, isCompleted, data }) {
  const [isExploding, setIsExploding] = React.useState(false);
  const isProjectClosed = data?.[0]?.percentage_completed < 100 && data?.[0]?.closed == true;
  const doExplosion = () => {
    isCompleted({ closed: isProjectClosed });
  };
  React.useEffect(() => {
    setIsExploding(true);
  }, []);
  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        onBackdropClick={handleClose}
      >
        <div style={style}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={trophy}
              style={{ height: 250, width: 250 }}
              loading="lazy"
              alt={<CircularProgress />}
            />
            {isExploding && (
              <ConfettiExplosion
                force={0.6}
                duration={2000}
                particleCount={500}
                height={2200}
                width={2200}
              />
            )}
            <br />
            {!isProjectClosed && (
              <h1
                style={{
                  color: '#627daf',
                  fontSize: '30px !important',
                  fontWeight: '900 !important',
                }}
              >
                Congratulations!
              </h1>
            )}
            <br />
            <h3>
              {isProjectClosed
                ? 'Do you want to re-open this project?'
                : 'It looks like all tasks have been completed, do you want to mark the project as complete?'}
            </h3>
            <br />
            <DialogActions>
              <Button
                variant="contained"
                onClick={handleClose}
                style={{
                  backgroundColor: '#6385b7',
                  color: '#ffffff',
                  fontSize: 16,
                  borderRadius: '8%',
                }}
              >
                No
              </Button>
              <Button
                variant="contained"
                onClick={doExplosion}
                style={{
                  backgroundColor: 'green',
                  color: '#ffffff',
                  fontSize: 16,
                  borderRadius: '8%',
                }}
              >
                Yes
              </Button>
            </DialogActions>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
}

export default React.memo(CongratulationsModal);
