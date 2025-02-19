import { Fab, FormControlLabel, IconButton, Switch, Tooltip } from '@mui/material';
import { Add, RefreshRounded } from '@mui/icons-material';
import SearchBar from '../../../component-lib/SearchBar/SearchBar';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../../Redux/Actions/loader';
import {
  addGroupPermissions,
  deleteGroupPermissions,
  getAccessGroups,
  getPermissionsList,
  singleAccessGroup,
  updateGroupAccess,
} from '../../../Redux/Actions/user-access';
import ConfirmDialog from '../../ProjectForm/Components/ConfirmDialog';
import CreateAccessForm from './CreateAccessForm';
import GroupTable from './GroupTable';

function AccessGroupList() {
  const dispatch = useDispatch();
  const [addPermissions, setAddPermissions] = useState(false);
  // TODO FIXME this seems wrong because selected never used
  // eslint-disable-next-line no-unused-vars
  const [selected, setSelected] = useState(null);
  const [add, setAdd] = useState(false);
  const [rows, setRows] = useState([]);
  const [searched, setSearched] = useState('');
  const userAccess = useSelector((state) => state.userAccessGroups);
  const userAccessData = userAccess?.data?.length > 0 ? userAccess?.data : [];
  const archivedAccess = userAccessData?.filter((access) => access.archived === true);
  const unArchivedAccess = userAccessData?.filter((access) => access.archived === false);
  const [switchedValue, setSwitchedValue] = React.useState(false);
  const [accessForm, setAccessForm] = React.useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [reqBody, setReqBody] = useState(null);

  useEffect(() => {
    doRefresh();
  }, []);

  useEffect(() => {
    if (switchedValue) {
      setRows(archivedAccess);
    } else {
      setRows(unArchivedAccess);
    }
  }, [userAccess]);

  const doRefresh = () => {
    cancelSearch();
    dispatch(show(true));
    dispatch(getAccessGroups());
    dispatch(getPermissionsList());
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = (userAccessData || [])?.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
    if (searchedVal === '') {
      setRows(userAccessData);
    }
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
    setRows(userAccessData);
  };

  const listenEvents = (event) => {
    setSelected({ id: event?.selected_id, name: event?.name });
    if (event?.edit) {
      setAdd(false);
      dispatch(singleAccessGroup({ id: event?.selected_id }));
      setAccessForm(true);
    }
    if (event?.addPermission) {
      setDialogMessage(
        `Are you sure, you want to give "${event?.permission_name}" permission to ${event.group_name} group?`,
      );
      setShowDialog(true);
      setAddPermissions(true);
      setReqBody({
        group: event?.group,
        permission: event?.selected_id,
      });
    }
    if (event?.deletePermission) {
      setDialogMessage(
        `Are you sure, you want to remove "${event?.permission_name}" permission from ${event.group_name} group?`,
      );
      setShowDialog(true);
      setAddPermissions(false);
      setReqBody({
        id: event?.selected_id,
      });
    }
    if (event?.handleArchive) {
      if (event?.archive) {
        setDialogMessage('Are you sure, you want to archive this access group?');
        setShowDialog(true);
        setReqBody({
          id: event?.selected_id,
          archived: true,
        });
      } else {
        setDialogMessage('Are you sure, you want to unarchive this access group?');
        setShowDialog(true);
        setReqBody({
          id: event?.selected_id,
          archived: false,
        });
      }
    }
  };

  const handleArchiveDialog = (event) => {
    if (event.close) {
      dispatch(updateGroupAccess({ id: reqBody?.id, data: { archived: reqBody?.archived } }));
      setTimeout(() => {
        setShowDialog(false);
      }, 1000);
    } else {
      setShowDialog(false);
    }
  };

  const handleDialog = (event) => {
    if (event.close) {
      if (addPermissions) {
        dispatch(addGroupPermissions({ data: reqBody }));
      } else {
        dispatch(deleteGroupPermissions(reqBody));
      }
      setTimeout(() => {
        setShowDialog(false);
      }, 1000);
    } else {
      setShowDialog(false);
    }
  };

  const handleAccessForm = () => {
    setAdd(true);
    setAccessForm(true);
  };

  const handleSwitch = () => {
    setSwitchedValue(!switchedValue);
    if (switchedValue) {
      setRows(unArchivedAccess);
    } else {
      setRows(archivedAccess);
    }
  };
  return (
    <div>
      <div
        style={{
          position: 'sticky',
          top: 180,
          zIndex: 9,
          backgroundColor: '#ffffff',
        }}
        className="d-flex-wrap justify-space-around w-100 p-5"
      >
        <div>
          <SearchBar
            style={{
              width: '100%',
              borderColor: '#eef2f6',
              backgroundColor: '#f9fbfd',
            }}
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          />
        </div>
        <div
          className="ArchivedAC"
          style={{ float: 'left' }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={switchedValue}
                onChange={handleSwitch}
              />
            }
            label={
              <span>
                {switchedValue ? 'Hide Archived Access Groups' : 'Display Archived Access Groups'}
              </span>
            }
          />
        </div>
        <div style={{ float: 'right' }}>
          <Tooltip
            title="Add New Access Group"
            placement="top"
            arrow
          >
            <Fab
              size="small"
              onClick={handleAccessForm}
              style={{ backgroundColor: '#627daf', color: '#ffffff' }}
            >
              <Add style={{ height: 30, width: 30 }} />
            </Fab>
          </Tooltip>
        </div>
        <div>
          <Tooltip
            title="Refresh Table"
            placement="top"
            arrow
          >
            <IconButton onClick={doRefresh}>
              <RefreshRounded style={{ color: '#627daf', height: 40, width: 40 }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <GroupTable
        data={rows}
        onPress={listenEvents}
      />
      {dialogMessage && (
        <ConfirmDialog
          dialogContent={dialogMessage}
          open={showDialog}
          handleClose={
            dialogMessage?.includes('archive') || dialogMessage?.includes('unarchive')
              ? handleArchiveDialog
              : handleDialog
          }
        />
      )}
      <CreateAccessForm
        open={accessForm}
        handleClose={() => setAccessForm(false)}
        forAdd={add}
      />
    </div>
  );
}

export default React.memo(AccessGroupList);
