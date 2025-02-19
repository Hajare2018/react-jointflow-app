import {
  DialogActions,
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
import AppButton from '../../../ProjectForm/Components/AppButton';
import {
  Add,
  CheckCircleOutline,
  CloseOutlined,
  DeleteForeverOutlined,
  InfoOutlined,
} from '@mui/icons-material';
import StatusTableModal from './StatusTableModal';
import {
  removePlaybookStatus,
  requestAnotherStatuses,
  requestSingleStatus,
} from '../../../../Redux/Actions/create-project';
import EditStatustable from './EditStatustable';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    top: '10%',
  },
  root: {
    padding: 4,
    color: '#222222',
  },
  body: {
    fontSize: 16,
    height: 20,
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogPaper: {
    position: 'absolute',
    right: 0,
    height: '100%',
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#eef2f6',
    color: theme.palette.common.black,
    fontWeight: '700',
    whiteSpace: 'nowrap',
    overflow: `hidden !important`,
    textOverflow: 'ellipsis',
  },
  root: {
    borderBottom: `0px !important`,
    padding: `8px !important`,
  },
  body: {
    fontSize: 16,
    height: 20,
    padding: 8,
  },
  alignRight: {
    textAlign: 'unset',
    flexDirection: 'unset',
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f5f5f5',
    },
  },
}))(TableRow);

function StatusTable({ board }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const statusData = useSelector((state) => state.statusesData);
  const status = statusData?.data?.length > 0 ? statusData?.data : [];

  const handleOpen = () => {
    dispatch(requestAnotherStatuses());
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (id) => {
    dispatch(requestSingleStatus({ id: id }));
    dispatch(requestAnotherStatuses());
    setEditStatus(true);
  };

  const handleCloseEdit = () => {
    setEditStatus(false);
  };

  const handleDeleteStatus = (id) => {
    dispatch(removePlaybookStatus({ id: id, board: board }));
  };
  return (
    <>
      <TableContainer
        style={{
          backgroundColor: '#ffff',
          padding: 10,
        }}
        component="div"
      >
        <span
          style={{
            width: '45%',
            display: 'flex',
            height: 'auto',
            margin: 5,
            backgroundColor: '#627daf',
            borderRadius: 4,
          }}
        >
          <div className="m-1">
            <InfoOutlined className="white-color" />
            <strong className="white-color">
              This section defines the possible statuses and outcomes available for the projects
              created from this playbook.
            </strong>
          </div>
        </span>
        <Table
          className={classes.table}
          stickyHeader
        >
          <TableHead>
            <StyledTableRow className={classes.root}>
              <StyledTableCell>Label</StyledTableCell>
              <StyledTableCell>System Status</StyledTableCell>
              <StyledTableCell>Mark Archived</StyledTableCell>
              <StyledTableCell>Mark Completed</StyledTableCell>
              <StyledTableCell>Positive</StyledTableCell>
              <StyledTableCell>Sync to CRM</StyledTableCell>
              <StyledTableCell>CRM Stage</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody className={classes.body}>
            {status?.map((row) => (
              <StyledTableRow key={row?.id}>
                <StyledTableCell>
                  <strong
                    className="app-color cursor-pointer"
                    onClick={() => handleEdit(row.id)}
                  >
                    {row.custom_label}
                  </strong>
                </StyledTableCell>
                <StyledTableCell>{row.status_details.system_status}</StyledTableCell>
                <StyledTableCell>
                  {row.status_details.mark_archived ? 'True' : 'False'}
                </StyledTableCell>
                <StyledTableCell>
                  {row.status_details.mark_completed ? 'True' : 'False'}
                </StyledTableCell>
                <StyledTableCell>{row.status_details.positive ? 'True' : 'False'}</StyledTableCell>
                <StyledTableCell>
                  {row.sync_to_crm ? (
                    <CheckCircleOutline className="text-green-500" />
                  ) : (
                    <CloseOutlined className="text-red-500" />
                  )}
                </StyledTableCell>
                <StyledTableCell>{row.crm_stage_label}</StyledTableCell>
                <StyledTableCell>
                  <button onClick={() => handleDeleteStatus(row.id)}>
                    <DeleteForeverOutlined style={{ color: 'red' }} />
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DialogActions>
        <AppButton
          onClick={handleOpen}
          outlined
          buttonIcon={<Add />}
          buttonText={'Add'}
          className={'internal-nudge'}
        />
      </DialogActions>
      <StatusTableModal
        open={open}
        handleClose={handleClose}
        board={board}
        forPlaybook
      />
      <EditStatustable
        open={editStatus}
        handleClose={handleCloseEdit}
      />
    </>
  );
}

export default React.memo(StatusTable);
