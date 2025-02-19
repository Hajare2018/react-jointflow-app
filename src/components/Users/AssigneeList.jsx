import {
  Avatar,
  Button,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createImageFromInitials } from '../Utils';
import { requestReassignOwner } from '../../Redux/Actions/login';
import { show } from '../../Redux/Actions/loader';

const StyledTableCell = withStyles((theme) => ({
  head: {
    color: theme.palette.common.black,
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

function AssigneeList({ open, handleClose, user }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(0);
  const [selected] = React.useState('');
  const loader = useSelector((state) => state.showLoader);
  const allUsersData = useSelector((state) => state.allUsersData);
  const allUsers = allUsersData.data.length > 0 ? allUsersData.data : [];
  const isSelected = (id) => selectedId === id;
  const handleClick = (data) => {
    dispatch(show(true));
    if (data?.email !== selected) {
      const reqBody = {
        old_user_id: user,
        new_user_id: data?.id,
      };
      setSelectedId(data?.id);
      dispatch(requestReassignOwner({ data: reqBody }));
    }
  };
  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={handleClose}
    >
      <TableContainer className={classes.container}>
        <Table
          className={classes.table}
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="left">Email</StyledTableCell>
              <StyledTableCell align="left">Role</StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {(allUsers || []).map((row) => {
              const isItemSelected = isSelected(row.id);
              return (
                <StyledTableRow
                  role={'checkbox'}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                >
                  <StyledTableCell
                    component="th"
                    scope="row"
                  >
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
                  <StyledTableCell padding={'checkbox'}>
                    <Button
                      variant="outlined"
                      style={{
                        border: `1px solid #6385b7`,
                        color: '#6385b7',
                        fontSize: 16,
                      }}
                      onClick={() => handleClick(row)}
                      className="app-color"
                    >
                      {loader.show && isItemSelected ? 'Assigning...' : '+Assign'}
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
}

export default React.memo(AssigneeList);
