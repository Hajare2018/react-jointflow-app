import React from 'react';
import wheels from '../assets/icons/animated_wheels.gif';

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

function MaintenancePage() {
  return (
    <div style={style}>
      <img
        src={wheels}
        style={{ height: 120, width: 'auto' }}
      />
      <div className="d-flex-column">
        <h2 style={{ color: '#627daf', fontWeight: 'bold' }}>We will back soon!</h2>
        <strong>Down for scheduled maintenance.</strong>
      </div>
    </div>
  );
}

export default React.memo(MaintenancePage);
