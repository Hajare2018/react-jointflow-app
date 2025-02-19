import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
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
import { Avatar } from '@mui/material';
import { createImageFromInitials, timeAgo } from '../Utils';
import { getAssignees } from '../../Redux/Actions/task-info';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#eef2f6',
    color: theme.palette.common.black,
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

function AssigneeHistory({ cardId, assignee_type }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const loader = useSelector((state) => state.showLoader);
  const allAssignees = useSelector((state) => state.assigneesData);
  const assignees_data = allAssignees?.data?.length > 0 ? allAssignees?.data : [];
  const internalAssignees = assignees_data?.filter((item) => item?.is_internal_assignee === true);
  const externalAssignees = assignees_data?.filter((item) => item?.is_internal_assignee === false);

  useEffect(() => {
    dispatch(show(true));
    dispatch(getAssignees({ card_id: cardId }));
  }, []);

  return (
    <>
      {loader.show ? (
        <Loader />
      ) : (
        <>
          {
            <TableContainer className={`${classes.container} tableWrap mt-3`}>
              <Table
                className={classes.table}
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="left">Email</StyledTableCell>
                    <StyledTableCell align="left">Phone</StyledTableCell>
                    <StyledTableCell align="left">Assigned by</StyledTableCell>
                    <StyledTableCell align="left">When</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(assignee_type?.internal ? internalAssignees : externalAssignees).map((row) => {
                    return (
                      // TODO FIXME
                      // eslint-disable-next-line react/jsx-key
                      <StyledTableRow>
                        <StyledTableCell
                          component="th"
                          scope="row"
                        >
                          <div className="d-flex">
                            <Avatar
                              src={
                                row?.assignee_details?.avatar
                                  ? row?.assignee_details?.avatar
                                  : row?.assignee_details?.avatar == null
                                    ? createImageFromInitials(
                                        300,
                                        row?.assignee_details?.first_name +
                                          ' ' +
                                          row?.assignee_details?.last_name,
                                        '#627daf',
                                      )
                                    : createImageFromInitials(
                                        300,
                                        row?.assignee_details?.first_name +
                                          ' ' +
                                          row?.assignee_details?.last_name,
                                        '#627daf',
                                      )
                              }
                            />
                            <div style={{ width: 10 }} />
                            {row?.assignee_details?.first_name +
                              ' ' +
                              row?.assignee_details?.last_name}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row?.assignee_details?.email}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row?.assignee_details?.phone_number === 'false'
                            ? 'Unknown'
                            : row?.assignee_details?.phone_number}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {(row?.assigned_by?.first_name || row?.assigned_by?.last_name) ==
                          undefined
                            ? 'N/A'
                            : row?.assigned_by?.first_name + ' ' + row?.assigned_by?.last_name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {timeAgo(new Date(row?.assigned_at).getTime())}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          }
        </>
      )}
    </>
  );
}

export default React.memo(AssigneeHistory);
