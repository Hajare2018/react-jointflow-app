import { AppBar, Button, Dialog, DialogActions, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Close from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { FaSlackHash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../Redux/Actions/loader';
import { requestNewSlackChannel } from '../../Redux/Actions/slack-stuffs';

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
}));

function CreateSlackChannel({ open, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [channelName, setChannelName] = useState(null);
  const loader = useSelector((state) => state.showLoader);
  const projectData = useSelector((state) => state.singleProjectData);
  const allData = projectData?.data?.length > 0 ? projectData?.data?.[0] : [];
  const handleChannelName = (event) => {
    setChannelName(event.target.value);
  };

  useEffect(() => {
    setChannelName(allData?.name);
  }, [projectData]);

  const doCreateChannel = () => {
    dispatch(show(true));
    dispatch(
      requestNewSlackChannel({
        data: {
          board_id: allData?.id,
          name: channelName,
        },
      }),
    );
    if (!loader.show) {
      setChannelName(null);
      handleClose();
    }
  };
  return (
    <Dialog
      maxWidth="sm"
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <div className="d-flex">
            <FaSlackHash
              color="inherit"
              className="mr-2"
            />
            <strong>{allData?.name}</strong>
          </div>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className="d-flex p-3">
        <div>
          <label className="form-label">Your Channel Name</label>
          <input
            type="text"
            className="text-input"
            value={channelName}
            name="channel_name"
            onChange={handleChannelName}
          />
        </div>
      </div>
      <DialogActions>
        <Button
          variant="contained"
          onClick={doCreateChannel}
          style={{
            backgroundColor: '#627daf',
            outline: 'none',
            color: '#ffffff',
            fontSize: '1.3rem',
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(CreateSlackChannel);
