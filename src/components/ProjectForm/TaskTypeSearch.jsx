import { AppBar, Dialog, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import SearchBar from '../../component-lib/SearchBar/SearchBar';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((_theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#ffffff',
    color: '#627daf',
  },
}));

function TaskTypeSearch({ data, open, handleClose, handleClick }) {
  const classes = useStyles();
  const [searched, setSearched] = useState('');
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState(data);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const requestSearch = (searchedVal) => {
    const filteredRows = data.filter((row) => {
      return row.custom_label.toLowerCase().includes(searchedVal.toLowerCase());
    });
    if (!filteredRows.length) {
      setMessage('No Result(s) found!');
    }
    setRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>Task Type Search</strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close style={{ fontSize: 30 }} />
          </IconButton>
        </Toolbar>
        <SearchBar
          style={{
            width: '100%',
            borderColor: '#aeaeae',
            backgroundColor: '#f9fbfd',
            padding: 10,
          }}
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        />
      </AppBar>
      <div className="p-3">
        {rows?.length > 0 ? (
          <ul>
            {rows.map((type) => (
              // TODO FIXME
              // eslint-disable-next-line react/jsx-key
              <li
                className="cursor-pointer"
                onClick={() => handleClick(type)}
              >
                {type.custom_label}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-centre">
            <strong>{message}</strong>
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default React.memo(TaskTypeSearch);
