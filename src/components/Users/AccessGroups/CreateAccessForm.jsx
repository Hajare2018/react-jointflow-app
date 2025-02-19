import { AppBar, Button, Dialog, DialogActions, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { CloseOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroupAccess, updateGroupAccess } from '../../../Redux/Actions/user-access';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#ffffff',
    color: '#627daf',
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
      margin: theme.spacing(2),
      fontWeight: '600',
      color: '#999',
    },
  },
  '& .MuiAutocomplete-input': {
    fontSize: 16,
  },
}));

function CreateAccessForm({ open, handleClose, forAdd }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const groupAccessData = useSelector((state) => state.singleAccessGroupData);
  const [form, setForm] = useState({
    name: '',
  });

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (forAdd) {
      setForm({
        name: '',
      });
    } else {
      setForm({
        name: (groupAccessData || [])?.data?.name || 'Loading...',
      });
    }
  }, [groupAccessData, forAdd]);

  useEffect(() => {}, [form]);

  const handleCreateAccess = (e) => {
    const reqBody = {
      name: form.name,
    };
    if (e.add) {
      dispatch(createGroupAccess({ data: reqBody }));
    } else {
      dispatch(updateGroupAccess({ id: (groupAccessData || [])?.data?.id, data: reqBody }));
    }
    setTimeout(() => {
      handleClear();
    }, 1000);
  };

  const handleClear = () => {
    setForm({
      name: '',
    });
    handleClose();
  };
  return (
    <Dialog
      maxWidth="md"
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <AppBar
        className={classes.appBar}
        style={{ position: 'sticky' }}
      >
        <Toolbar className="justify-space-between">
          <strong>
            {forAdd ? 'Add Access Group' : 'Edit ' + (groupAccessData || [])?.data?.name}
          </strong>
          <IconButton
            onClick={handleClose}
            edge="start"
            color="inherit"
            aria-label="close"
          >
            <CloseOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className="p-10">
        <label className="form-label">Name</label>
        <input
          type="text"
          name="name"
          className={form.name === '' ? 'error-form-control' : 'text-input'}
          value={form.name}
          onChange={handleForm}
        />
      </div>
      <DialogActions>
        <Button
          variant="outlined"
          style={{ color: '#6385b7', fontSize: 16 }}
          onClick={handleClear}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          style={{ backgroundColor: '#6385b7', color: '#ffffff', fontSize: 16 }}
          onClick={() => handleCreateAccess({ add: forAdd })}
        >
          {forAdd ? 'Add' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(CreateAccessForm);
