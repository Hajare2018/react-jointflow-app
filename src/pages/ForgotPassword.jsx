import { Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import PasswordChecklist from 'react-password-checklist';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../Redux/Actions/loader';
import { doResetPassword } from '../Redux/Actions/login';

const centreStyle = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  position: 'absolute',
  padding: 20,
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  textAlign: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(98,125,175,0.5)',
  color: '#ffffff',
  borderRadius: 7,
  boxShadow: 24,
  p: 4,
};

function ForgotPassword() {
  const [password, setPassword] = useState('');
  const url = new URL(window.location.href);
  const loader = useSelector((state) => state.showLoader);
  const dispatch = useDispatch();
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const [disable, setDisable] = useState(true);
  const submitPassword = () => {
    let usr_id = new URLSearchParams(url.search).get('usr');
    const reqBody = {
      password: password,
    };
    dispatch(show(true));
    dispatch(
      doResetPassword({
        user_id: usr_id,
        password: reqBody,
      }),
    );
    if (!loader.show) {
      setPassword('');
    }
  };
  return (
    <div style={centreStyle}>
      <strong>Please enter your New Password here:</strong>
      <br />
      <div className="d-flex-column justify-centre">
        <div className="mb-3">
          <input
            type="password"
            className="text-input"
            style={{ color: '#000000' }}
            value={password}
            onChange={handlePassword}
          />
        </div>
        <Button
          variant="contained"
          disabled={disable}
          style={{
            backgroundColor: disable ? '#999' : '#33e0b3',
            color: '#ffffff',
          }}
          onClick={submitPassword}
        >
          {loader.show ? <CircularProgress color="inherit" /> : 'Update Password'}
        </Button>{' '}
        <br />
        <PasswordChecklist
          rules={['minLength', 'specialChar', 'number', 'capital']}
          style={{ color: '#ffffff' }}
          minLength={5}
          value={password}
          onChange={(isValid) => {
            if (isValid) {
              setDisable(false);
            } else {
              setDisable(true);
            }
          }}
        />
      </div>
    </div>
  );
}

export default React.memo(ForgotPassword);
