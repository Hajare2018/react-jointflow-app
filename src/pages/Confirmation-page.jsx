import React from 'react';
import tickMark from '../assets/icons/check-mark-verified.gif';

const style = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  position: 'absolute',
  padding: 20,
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  textAlign: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  border: '2px solid #627daf',
  boxShadow: 24,
  p: 4,
};

function ConfirmationPage() {
  const url = window.location.href;
  return (
    <div style={style}>
      <img
        src={tickMark}
        style={{ height: 120, width: 120 }}
      />
      <div className="d-flex-column">
        {url.includes('access_link') ? (
          <h3>You will shortly receive your new access link.</h3>
        ) : (
          <>
            <h2 style={{ color: '#627daf', fontWeight: 'bold' }}>Welcome to Jointflows!</h2>
            <h3>Your admin user will shortly receive an email with a unique access link!</h3>
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(ConfirmationPage);
