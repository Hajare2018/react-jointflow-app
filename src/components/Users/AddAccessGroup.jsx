import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { displayDialog } from '../../Redux/Actions/loader';
import { saveAccessGroup } from '../../Redux/Actions/user-access';
import AutoComplete from '../AutoComplete';

export default function AddAccessGroup({ open }) {
  const dispatch = useDispatch();
  const [accessGroup, setAccessGroup] = useState([]);
  const user = useSelector((state) => state.createdUserData);
  const handleSelectedAccess = (e) => {
    setAccessGroup(e);
  };
  const addAccessGroups = () => {
    if (accessGroup?.length > 0) {
      let group = [];
      accessGroup?.forEach((access) => {
        group.push({
          user: user?.data?.user_id,
          group: access.id,
        });
      });
      dispatch(saveAccessGroup(group));
      setAccessGroup([]);
      handleClear();
    }
  };

  const handleClear = () => {
    setAccessGroup([]);
    dispatch(displayDialog(false));
  };
  return (
    <Dialog open={open}>
      <DialogTitle
        style={{ fontSize: 22 }}
        id="alert-dialog-title"
      >
        Add {user?.data?.username} to an access group
      </DialogTitle>
      <DialogContent>
        <AutoComplete
          selected={handleSelectedAccess}
          forAdd
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClear}
          color="primary"
        >
          CANCEL
        </Button>
        <Button
          onClick={addAccessGroups}
          color="primary"
        >
          ADD
        </Button>
      </DialogActions>
    </Dialog>
  );
}
