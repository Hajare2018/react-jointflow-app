import { AppBar, Button, Dialog, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postReactivationData } from '../Redux/Actions/nudge-mail';
import { show } from '../Redux/Actions/loader';
import { requestResetPassword } from '../Redux/Actions/login';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
  marginLeft: theme.spacing(2),
  flex: 1,
  dialogPaper: {
    position: 'absolute',
    right: 0,
    height: '100%',
  },
  '& > *': {
    root: {
      margin: theme.spacing(0),
      fontWeight: '600',
      color: '#999',
    },
  },
  '& .MuiAutocomplete-input': {
    fontSize: 16,
  },
}));

export default function EmailDialog({ open, handleClose, autoFilled, forPassword }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const loader = useSelector((state) => state.showLoader);
  const handleEmail = (event) => {
    setEmail(event.target.value.toLowerCase());
  };

  useEffect(() => {
    if (autoFilled !== '') {
      setEmail(autoFilled);
    }
  }, [autoFilled]);

  const sendEmail = () => {
    const reqBody = {
      email_address: email,
    };
    dispatch(show(true));
    if (forPassword) {
      dispatch(requestResetPassword({ data: reqBody }));
    } else {
      dispatch(postReactivationData({ email: reqBody }));
    }
    if (!loader.show) {
      handleClose();
    }
  };
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <strong>{forPassword ? 'Forgot Password' : 'Send Activation Email'}</strong>
          <IconButton
            onClick={handleClose}
            edge="start"
            color="inherit"
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 20 }}>
        <div className="d-flex-column justify-centre">
          <div className="mb-3">
            <label className="form-label">Your Email</label>
            <input
              type="text"
              className="text-input"
              value={email}
              onChange={handleEmail}
              autoFocus
            />
          </div>
          <Button
            variant="contained"
            style={{ backgroundColor: '#627daf', color: '#ffffff' }}
            onClick={sendEmail}
          >
            Send reset Email
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
