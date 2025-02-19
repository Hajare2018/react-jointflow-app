import {
  AppBar,
  Avatar,
  Button,
  Chip,
  Dialog,
  IconButton,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createImageFromInitials } from './Utils';
import { requestMaapAccess } from '../Redux/Actions/user-access';
import AddNewUser from './Users/AddNewUser';
import SearchBar from '../component-lib/SearchBar/SearchBar';
import { setMessage } from '../Redux/Actions/loader';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const StyledTableCell = withStyles(() => ({
  head: {
    color: '#000000',
    backgroundColor: '#eef2f6',
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f5f5f5',
    },
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: 'rgba(183, 244, 216, 0.7)',
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
    height: 40,
  },
  appBar: {
    position: 'sticky',
    backgroundColor: '#ffffff',
    color: '#627daf',
  },
  title: {
    marginLeft: 5,
    flex: 1,
  },
  dialogPaper: {
    position: 'absolute',
    right: 0,
    height: '100%',
  },
  container: {
    maxHeight: `65vh`,
    '@media(max-height: 1080px)': {
      maxHeight: 685,
    },
    '@media(max-height: 1024px)': {
      maxHeight: 620,
    },
    '@media(max-height: 900px)': {
      maxHeight: 500,
    },
    '@media(max-height: 768px)': {
      maxHeight: 370,
    },
  },
});

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: '#000000',
          backgroundColor: 'rgba(183, 244, 216, 0.7)',
        }
      : {
          color: '#000000',
          backgroundColor: 'rgba(183, 244, 216, 0.7)',
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = ({ numSelected, selected_user_id, closeModal, id }) => {
  const classes = useToolbarStyles();
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);

  const goNext = () => {
    const reqBody = {
      contact_id: selected_user_id,
      board_id: id,
    };
    dispatch(requestMaapAccess({ data: reqBody }));
    if (!loader.show) {
      closeModal();
    }
  };
  return (
    <>
      <Toolbar
        style={{ display: 'flex' }}
        className={clsx(classes.root, {
          [classes.highlight]: numSelected,
        })}
      >
        {numSelected ? (
          <div style={{ width: '100%', padding: 10 }}>
            <Typography
              style={{ float: 'left' }}
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
            <Button
              variant="contained"
              className="next-btn"
              onClick={goNext}
            >
              ADD MEMBER
            </Button>
          </div>
        ) : (
          ''
        )}
      </Toolbar>
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function TeamMembers({ open, handleClose, board, company_id }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selected, setSelected] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(0);
  const [openForm, setOpenForm] = React.useState(false);
  const [rows, setRows] = useState(null);
  const [searched, setSearched] = useState('');
  const [user, setUser] = React.useState('external');
  const users = useSelector((state) => state.allLightUsersData);
  const staffs = useSelector((state) => state.allUsersData);
  const loader = useSelector((state) => state.showLoader);
  const usersData = users?.data?.length > 0 ? users?.data : [];
  const staffsData = staffs?.data?.length > 0 ? staffs?.data : [];
  const allData = [...usersData, ...staffsData];
  allData.sort((a, b) => {
    if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) {
      return -1;
    }
    if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) {
      return 1;
    }
    return 0;
  });
  const handleClick = (data) => {
    let newSelected = selected;
    if (data?.email !== selected) {
      newSelected = data?.email;
      setSelectedUser(data?.first_name);
      setSelectedId(data?.id);
    }
    setSelected(newSelected);
  };

  const handleToggle = (event, newValue) => {
    setUser(newValue);
    setRows(newValue === 'external' ? usersData : staffsData);
  };

  const handleAddUser = () => {
    setOpenForm(!openForm);
  };

  useEffect(() => {
    if (user === 'external') {
      setRows(usersData);
    } else {
      setRows(staffsData);
    }
  }, [users, staffs]);

  useEffect(() => {
    setSelectedId(selectedId);
  }, [selectedId]);
  const isSelected = (id) => selectedId === id;

  const requestSearch = (searchedVal) => {
    const filteredRows = allData.filter((row) => {
      return row.first_name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    if (!filteredRows.length) {
      dispatch(setMessage('No Record(s) found!'));
    }
    setRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
      onClose={handleClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="d-flex justify-space-between">
          <strong>Team Members</strong>
          <SearchBar
            className="search-bar search"
            placeholder="Search by Name"
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          />
          <div>
            <ToggleButtonGroup
              color="primary"
              value={user}
              exclusive
              aria-label="Platform"
              size="small"
              onChange={handleToggle}
            >
              <ToggleButton value="internal">Internal</ToggleButton>
              <ToggleButton value="external">External</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <TableContainer className={classes.container}>
        {loader.show ? (
          <div className="text-centre m-3">
            <strong>Loading...</strong>
          </div>
        ) : allData?.length > 0 ? (
          <Table
            className={classes.table}
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <StyledTableCell />
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="left">Email</StyledTableCell>
                <StyledTableCell align="left">Role</StyledTableCell>
                <StyledTableCell align="left">Side</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rows || []).map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow
                    role={'checkbox'}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <StyledTableCell padding={'checkbox'}>
                      <Radio
                        checked={isItemSelected}
                        onChange={() => handleClick(row)}
                        color="success"
                        inputProps={{ 'aria-labelledby': labelId }}
                        className={`radio-btn`}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="d-flex">
                        <Avatar className="avatar-size mr-2">
                          <img
                            src={
                              row.avatar
                                ? row.avatar
                                : row.avatar === null
                                  ? createImageFromInitials(
                                      300,
                                      row?.first_name + ' ' + row?.last_name,
                                      '#627daf',
                                    )
                                  : createImageFromInitials(
                                      300,
                                      row?.first_name + ' ' + row?.last_name,
                                      '#627daf',
                                    )
                            }
                            className="img-lazy-avatar"
                            loading="lazy"
                          />
                        </Avatar>
                        {row?.first_name + ' ' + row?.last_name}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="left">{row?.email}</StyledTableCell>
                    <StyledTableCell align="left">{row?.role}</StyledTableCell>
                    <StyledTableCell>
                      {row?.is_staff ? (
                        <Chip
                          label={<strong>Internal</strong>}
                          size="small"
                          variant="default"
                          style={{
                            color: '#627daf',
                            backgroundColor: 'rgba(98,125,175,0.3)',
                          }}
                        />
                      ) : (
                        <Chip
                          label={<strong>External</strong>}
                          size="small"
                          variant="default"
                          style={{
                            color: '#222222',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                          }}
                        />
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <strong>No Users found!</strong>
        )}
        <AppBar
          position="sticky"
          style={{ top: 'auto', bottom: 0, backgroundColor: '#ffffff' }}
        >
          {selected ? (
            <EnhancedTableToolbar
              numSelected={selectedUser}
              selected_user_id={selectedId}
              closeModal={handleClose}
              id={board}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: 5,
              }}
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: '#6385b7',
                  color: '#ffffff',
                  fontSize: 16,
                }}
                onClick={handleAddUser}
              >
                {user === 'internal' ? '+ADD Colleague' : '+ADD Contact'}
              </Button>
            </div>
          )}
        </AppBar>
        <AddNewUser
          forCompany={user === 'external' ? true : false}
          forEdit={{ id: company_id }}
          handleClose={handleAddUser}
          open={openForm}
          addContact
        />
      </TableContainer>
    </Dialog>
  );
}

export default React.memo(TeamMembers);
