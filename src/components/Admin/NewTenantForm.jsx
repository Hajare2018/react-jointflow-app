import {
  AppBar,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  IconButton,
  Toolbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close, Visibility, VisibilityOffOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveTenant } from '../../Redux/Actions/admin/tenant-list';
import { show } from '../../Redux/Actions/loader';
import { isAlphanumeric } from '../Utils';

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
}));

function NewTenantForm({ open, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const [trial, setTrial] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: '',
    schema_name: '',
    email: 'contact@jointflows.com',
    password: '',
    url: '',
  });

  const handleTrial = () => {
    setTrial(!trial);
  };

  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  const handleForm = (event) => {
    if (event.target.name === 'schema_name') {
      if (isAlphanumeric(event.target.value)) {
        setForm({ ...form, ['schema_name']: event.target.value });
      }
    } else {
      setForm({ ...form, [event.target.name]: event.target.value });
    }
  };

  const handleClearForm = () => {
    setForm({
      name: '',
      schema_name: '',
      email: 'contact@jointflows.com',
      password: '',
      url: '',
    });
    setTrial(false);
    handleClose();
  };

  const handleSaveTenant = () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('schema_name', form.schema_name);
    formData.append('email_address', form.email);
    formData.append('password', form.password);
    formData.append('ontrial', trial);
    formData.append('url', form.url);
    dispatch(show(true));
    dispatch(saveTenant({ data: formData }));
    if (!loader.show) {
      handleClearForm();
    }
  };

  useEffect(() => {}, [form, trial]);
  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        aria-labelledby="form-dialog-title"
      >
        <AppBar className={classes.appBar}>
          <Toolbar className="justify-space-between">
            <strong>Add New Tenant</strong>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClearForm}
              aria-label="close"
            >
              <Close style={{ fontSize: 30 }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className="d-flex-column p-15">
          <div className="d-flex mb-3">
            <div className="flex-5 mr-3">
              <label className="form-label">
                Company Name<span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                className="text-input"
                value={form.name}
                onChange={handleForm}
                maxLength={20}
              />
            </div>
            <div className="flex-5">
              <label className="form-label">
                Schema Name<span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="schema_name"
                className="text-input"
                value={form.schema_name}
                onChange={handleForm}
                maxLength={20}
              />
            </div>
          </div>
          <div className="d-flex mb-3">
            <div className="flex-5 mr-3">
              <label className="form-label">Email</label>
              <input
                type="text"
                name="email"
                className="text-input"
                value={form.email}
                onChange={handleForm}
              />
            </div>
            <div className="flex-5">
              <label className="form-label">Password</label>
              <div className="d-flex text-input">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleForm}
                  maxLength={20}
                />
                <div onClick={handleShowPass}>
                  {showPass ? <Visibility /> : <VisibilityOffOutlined />}
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex mb-3">
            <div className="flex-5 mr-3">
              <label className="form-label">Company Url</label>
              <input
                type="text"
                name="url"
                className="text-input"
                value={form.url}
                onChange={handleForm}
              />
            </div>
            <div className="flex-5">
              <div className="d-flex selectbox">
                <Checkbox
                  checked={trial}
                  onChange={handleTrial}
                />
                <label className="form-label">
                  On Trial<span style={{ color: 'red' }}>*</span>
                </label>
              </div>
            </div>
          </div>
          <div className="d-flex justify-end">
            <Button
              style={{
                backgroundColor: '#6385b7',
                color: '#ffffff',
                textTransform: 'none',
              }}
              variant="contained"
              onClick={handleSaveTenant}
            >
              {loader.show ? <CircularProgress /> : 'Save'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default React.memo(NewTenantForm);
