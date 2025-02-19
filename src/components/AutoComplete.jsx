import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/lab/Autocomplete';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAccessGroup, getAccessGroups } from '../Redux/Actions/user-access';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function AutoComplete({ selected, user_access, forAdd }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [newValue, setNewValue] = useState(user_access);
  const accessGroups = useSelector((state) => state.userAccessGroups);
  const filteredGroups =
    accessGroups?.data?.length > 0
      ? accessGroups?.data?.filter((group) => group.archived === false)
      : [];

  useEffect(() => {
    setNewValue(user_access);
    dispatch(getAccessGroups());
  }, []);

  return (
    <div className={classes.root}>
      <Autocomplete
        key={newValue?.[0]?.id}
        multiple
        id="tags-outlined"
        options={filteredGroups}
        value={newValue}
        getOptionLabel={(option) => option.name}
        onChange={(event, value, reason, detail) => {
          setNewValue(value);
          selected(value);
          if (reason === 'remove-option' && !forAdd) {
            dispatch(deleteAccessGroup({ group: detail?.option?.id }));
          }
        }}
        renderInput={(params) => (
          <TextField
            fullWidth
            {...params}
            variant="outlined"
            placeholder="Access"
          />
        )}
      />
    </div>
  );
}

export default React.memo(AutoComplete);
