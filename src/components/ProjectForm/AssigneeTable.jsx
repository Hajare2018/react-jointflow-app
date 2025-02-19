import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@mui/styles';
import clsx from 'clsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../Redux/Actions/loader';
import Loader from '../Loader';
import '../Documents/DocumentsLibrary/document.css';
import { AppBar, Avatar, Button, Grid, Radio, Toolbar, Typography } from '@mui/material';
import { createImageFromInitials, getDevice } from '../Utils';
import editTaskData from '../../Redux/Actions/update-task-info';
import AddNewUser from '../Users/AddNewUser';
import EditComment from '../CommentWindow/EditComment';
import UsersCard from '../UsersCard';
import { editDealPolice } from '../../Redux/Actions/deal-police';
import { requestReassignUser } from '../../Redux/Actions/user-access';
import { useUserContext } from '../../context/UserContext';

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
    height: 40,
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

const EnhancedTableToolbar = ({
  numSelected,
  assignment_type,
  selected_user_id,
  closeModal,
  latest,
  updateFor,
  isPolice,
  isReassign,
  board_id,
}) => {
  const classes = useToolbarStyles();
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const [open, setOpen] = useState(false);
  const { user: parsedData } = useUserContext();

  const handleNext = (e) => {
    if (e.close) {
      handleTaskAssignment(e.comment_data);
    } else {
      setOpen(!open);
    }
  };

  const goNext = () => {
    if (isPolice) {
      handleDealPoliceDetails();
    } else if (selected_user_id === parsedData?.id) {
      handleTaskAssignment();
    } else {
      setOpen(true);
    }
  };

  const handleReassign = () => {
    const reqBody = { user_id: selected_user_id, board_id: board_id };
    dispatch(requestReassignUser({ data: reqBody }));
    closeModal();
  };

  const handleDealPoliceDetails = () => {
    const formData = new FormData();
    formData.append('fallback_contact', selected_user_id);
    dispatch(show(true));
    dispatch(
      editDealPolice({
        deal_police_id:
          latest?.external_assignee_deal_police?.deal_police == null
            ? latest?.external_assignee_deal_police?.id
            : latest?.external_assignee_deal_police?.deal_police?.[0]?.id,
        data: formData,
        card_id: 'task_id' in (latest || {}) ? latest?.task_id : latest?.id,
      }),
    );
  };

  useEffect(() => {}, [latest]);

  const handleTaskAssignment = (comment_data) => {
    dispatch(
      editTaskData({
        id: 'task_id' in (latest || {}) ? latest?.task_id : latest?.id,
        title: latest?.title,
        start_date: latest?.start_date,
        end_date: latest?.end_date,
        description: latest?.description,
        board: latest?.board,
        owner: latest?.owner_details?.id,
        color: latest?.color,
        is_completed: latest?.is_completed,
        last_update_type: assignment_type?.internal ? 'Internal Assignment' : 'External Assignment',
        external_assignee:
          assignment_type?.external && latest?.external_assignee_details !== null
            ? selected_user_id
            : assignment_type?.external && latest?.external_assignee_details === null
              ? selected_user_id
              : !assignment_type?.external && latest?.external_assignee_details !== null
                ? latest?.external_assignee_details?.id
                : !assignment_type?.external && latest?.external_assignee_details === null
                  ? null
                  : '',
        internal_assignee:
          assignment_type?.internal && latest?.internal_assignee_details !== null
            ? selected_user_id
            : assignment_type?.internal && latest?.internal_assignee_details === null
              ? selected_user_id
              : !assignment_type?.internal && latest?.internal_assignee_details !== null
                ? latest?.internal_assignee_details?.id
                : !assignment_type?.internal && latest?.internal_assignee_details === null
                  ? null
                  : '',
        filteredTasks: {
          allCards: updateFor?.allCards,
          completed: updateFor?.completed,
          upcoming: updateFor?.upcoming,
        },
        fetchByType: updateFor?.task_type !== '' ? true : false,
        type: updateFor?.task_type !== '' ? updateFor?.task_type : '',
        completed: updateFor?.completed,
        legalTasks: {
          isLegal: updateFor?.allCards,
          isLegal__completed: updateFor?.completed,
          isLegal__upcoming: updateFor?.upcoming,
        },
        task_info: selected_user_id == parsedData?.id,
        isComment: selected_user_id == parsedData?.id ? false : true,
        forComment: comment_data,
        userId: parsedData.id,
      }),
    );
    if (!loader.show) {
      setOpen(false);
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
            {isReassign ? (
              <Button
                variant="contained"
                className="next-btn"
                onClick={handleReassign}
              >
                Reassign
              </Button>
            ) : (
              <Button
                variant="contained"
                className="next-btn"
                onClick={goNext}
              >
                {isPolice || selected_user_id === parsedData?.id ? 'Save' : 'Next'}
              </Button>
            )}
          </div>
        ) : (
          ''
        )}
      </Toolbar>
      <EditComment
        open={open}
        handleClose={handleNext}
        forEdit={{
          card_id: 'task_id' in (latest || {}) ? latest?.task_id : latest?.id,
          board: 'task_id' in (latest || {}) ? latest?.board : latest?.board,
        }}
        forAssignees
        is_client_facing={assignment_type?.external ? true : false}
      />
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function AssigneeTable({
  card_data,
  assignee_type,
  close,
  updated_data,
  selected_user,
  view,
  updateBy,
  police,
  reassignment,
  board,
}) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState('');
  const [selectedId, setSelectedId] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const message = useSelector((state) => state.messageData);
  const handleAddUser = () => {
    setOpenForm(!openForm);
  };

  const handleClick = (data) => {
    let newSelected = selected;
    if (data?.email !== selected) {
      newSelected = data?.email;
      setSelectedUser(data?.first_name);
      setSelectedId(data?.id);
    }
    setSelected(newSelected);
    if (!reassignment) {
      selected_user(data?.first_name + ' ' + data?.last_name);
    }
  };

  useEffect(() => {
    setSelectedId(selectedId);
  }, [selectedId]);

  const [users, setUsers] = useState([]);
  const allUsersData = useSelector((state) => state.allUsersData);
  const allUsers = allUsersData?.data?.length > 0 ? allUsersData?.data : [];
  const allBuyers = useSelector((state) => state.allLightUsersData);
  const buyersData = allBuyers?.data?.length > 0 ? allBuyers?.data : [];
  const activeUsers = allUsers.filter((item) => item.is_active === true);
  const sellers = activeUsers.filter((item) => item?.is_staff === true);
  const loader = useSelector((state) => state.showLoader);

  useEffect(() => {
    if (assignee_type?.internal) {
      setUsers(allUsers);
    } else {
      setUsers(buyersData);
    }
  }, [allUsersData, allBuyers]);

  const isSelected = (id) => selectedId === id;
  const isMobile = getDevice();

  return loader.show ? (
    <Loader />
  ) : (
    <TableContainer className={classes.container}>
      {view === 'list_view' && !isMobile ? (
        users?.length > 0 ? (
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
              </TableRow>
            </TableHead>
            <TableBody>
              {(users || []).map((row, index) => {
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
                        className={`radio-btn-${index}`}
                      />
                    </StyledTableCell>
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
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-centre p-3">
            <strong>{message.message}</strong>
          </div>
        )
      ) : (
        <Grid
          container
          style={{ padding: 10 }}
        >
          {(users || []).map((row) => {
            return (
              <Grid
                key={row.id}
                item
                xs={12}
                sm={12}
                md={12}
                lg={(sellers || [])?.length <= 2 ? 12 : 4}
              >
                <UsersCard
                  user={row}
                  selected={isSelected}
                  onSelect={handleClick}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
      <AppBar
        position="sticky"
        style={{ top: 'auto', bottom: 0, backgroundColor: '#ffffff' }}
      >
        {selected ? (
          <EnhancedTableToolbar
            numSelected={selectedUser}
            selected_user_id={selectedId}
            assignment_type={assignee_type}
            card={card_data}
            latest={updated_data}
            closeModal={close}
            updateFor={updateBy}
            isPolice={police}
            board_id={board}
            isReassign={reassignment}
          />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: '#6385b7',
                color: '#ffffff',
                fontSize: 16,
              }}
              onClick={handleAddUser}
            >
              +ADD
            </Button>
          </div>
        )}
      </AppBar>
      <AddNewUser
        forCompany={assignee_type?.external ? true : false}
        forEdit={{ id: card_data?.buyer_company?.id }}
        handleClose={handleAddUser}
        open={openForm}
        addContact
      />
    </TableContainer>
  );
}

export default React.memo(AssigneeTable);
