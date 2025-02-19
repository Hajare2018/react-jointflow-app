import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { requestDocumentsType, requestSingleType } from '../../Redux/Actions/documents-type';
import { keepData, setMessage, show } from '../../Redux/Actions/loader';
import Loader from '../Loader';
import { Add, Edit, RefreshRounded } from '@mui/icons-material';
import { Fab, FormControlLabel, IconButton, Switch, TableSortLabel, Tooltip } from '@mui/material';
import EditType from './EditType';
import '../Documents/DocumentsLibrary/document.css';
import ConfirmationDialog from './ConfirmationDialog';
import { withStyles } from '@mui/styles';
import ArchiveIcon from '../../assets/icons/archive.png';
import ArchiveDanger from '../../assets/icons/archive_danger.png';
import SearchBar from '../../component-lib/SearchBar/SearchBar';
import { getAllUsers } from '../../Redux/Actions/user-info';
import { getPlurals } from '../Utils';
import { stableSort, getComparator } from '../../component-lib/JFTable/JFTable';

const headCells = [
  {
    id: 'custom_label',
    numeric: false,
    disablePadding: false,
    label: 'Custom Label',
  },
  {
    id: 'department',
    numeric: false,
    disablePadding: false,
    label: 'Department',
  },
  {
    id: 'template_owner_assigned',
    numeric: false,
    disablePadding: false,
    label: 'Pre-assigned',
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
  },
  {
    id: 'weight',
    numeric: false,
    disablePadding: false,
    label: 'Weight',
  },
  {
    id: 'side',
    numeric: false,
    disablePadding: false,
    label: 'Side',
  },
  {
    id: 'duartion',
    numeric: false,
    disablePadding: false,
    label: 'Durations',
  },
  { id: 'color', numeric: false, disablePadding: false, label: 'Color' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];
function EnhancedTableHead({ classes, order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.id === 'custom_label' ? '25%' : '' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>{order === 'desc' ? '' : ''}</span>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
  container: {
    maxHeight: `calc(100vh - 278px)`,
  },
});

const StyledTableCell = withStyles(() => ({
  head: {
    color: '#000000',
    fontWeight: '900',
    width: 150,
  },
  root: {
    borderBottom: `0px !important`,
    padding: `8px !important`,
  },
  body: {
    height: 35,
    padding: 8,
  },
  '&.MuiTableCell-stickyHeader': {
    backgroundColor: '#eef2f6',
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

function TaskTypaTable() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [switchedValue, setSwitchedValue] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [editData, setEditData] = useState([]);
  const [searched, setSearched] = useState('');
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('end_date');
  const [isAdd, setIsAdd] = useState(true);
  const documentTypeData = useSelector((state) => state.documentsType);
  const message = useSelector((state) => state.messageData);

  const handleOpen = (e) => {
    setIsAdd(e.add);
    setEditData(e);
    dispatch(getAllUsers({ onlyStaff: true }));
    setOpen(true);
    if (!e.add) {
      dispatch(show(true));
      dispatch(keepData(true));
      dispatch(requestSingleType({ id: e.data.id }));
    } else {
      dispatch(keepData(false));
      return;
    }
  };

  const handleClose = () => setOpen(false);

  const handleOpenConfirm = (e) => {
    setEditData(e);
    setConfirm(true);
  };

  const handleCloseConfirm = () => {
    setConfirm(false);
  };

  const allDocumentType = documentTypeData?.data?.length > 0 ? documentTypeData?.data : [];

  const handleSwitch = () => {
    doRefresh();
    setSwitchedValue(!switchedValue);
    if (switchedValue) {
      const unArchived = allDocumentType?.filter((type) => type?.active === true);
      setAllRows(unArchived);
      setRows(unArchived);
      if (!unArchived?.length) {
        dispatch(setMessage('No Record(s) found!'));
      }
    } else {
      const archived = allDocumentType?.filter((type) => type?.active === false);
      setAllRows(archived);
      setRows(archived);
      if (!archived?.length) {
        dispatch(setMessage('No Record(s) found!'));
      }
    }
  };

  useEffect(() => {
    if (switchedValue) {
      const archived = allDocumentType?.filter((type) => type?.active === false);
      setAllRows(archived);
      setRows(archived);
      if (!archived?.length) {
        dispatch(setMessage('No Record(s) found!'));
      }
    } else {
      const unArchived = allDocumentType?.filter((type) => type?.active === true);
      setAllRows(unArchived);
      setRows(unArchived);
      if (!unArchived?.length) {
        dispatch(setMessage('No Record(s) found!'));
      }
    }
  }, [documentTypeData]);

  const loader = useSelector((state) => state.showLoader);
  useEffect(() => {
    doRefresh();
  }, []);

  const doRefresh = () => {
    dispatch(show(true));
    dispatch(requestDocumentsType());
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = (allRows || []).filter((row) => {
      return row.custom_label.toLowerCase().includes(searchedVal.toLowerCase());
    });
    if (!filteredRows?.length) {
      setRows([]);
      dispatch(setMessage('No Record(s) found!'));
    } else {
      setRows(filteredRows);
    }
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <>
      <div className="d-flex-wrap justify-space-around w-100 p-5">
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
                name="checkedA"
              />
            }
            label={
              <span>
                {switchedValue ? 'Hide Archived Document Type' : 'Show Archived Document Type'}
              </span>
            }
          />
        </div>
        <div style={{ float: 'right' }}>
          <Tooltip
            title="Add New Entry"
            placement="top"
            arrow
          >
            <Fab
              size="small"
              onClick={() => {
                handleOpen({ add: true });
              }}
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
      {loader.show ? (
        <Loader />
      ) : (
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            stickyHeader
          >
            {rows?.length > 0 ? (
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            ) : (
              <div className="mt-6 text-centre">
                <strong>{message.message}</strong>
              </div>
            )}
            <TableBody>
              {stableSort(rows?.length > 0 ? rows : [], getComparator(order, orderBy)).map(
                (row) => (
                  <StyledTableRow
                    key={row.id}
                    style={{ height: 40 }}
                  >
                    <StyledTableCell>
                      <div
                        style={{
                          color: '#627daf',
                          fontWeight: '700',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                        onClick={() => {
                          handleOpen({ data: row, add: false });
                        }}
                      >
                        {row?.custom_label}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>{row?.department}</StyledTableCell>
                    <StyledTableCell>
                      {row?.internal_assignee == null && row?.template_owner_assigned
                        ? '<Project Owner>'
                        : row?.internal_assignee_details == null
                          ? ''
                          : row?.internal_assignee_details?.first_name +
                            ' ' +
                            row?.internal_assignee_details?.last_name}
                    </StyledTableCell>
                    <StyledTableCell>{row?.category}</StyledTableCell>
                    <StyledTableCell>{row?.weight}</StyledTableCell>
                    <StyledTableCell>{row?.side}</StyledTableCell>
                    <StyledTableCell>{getPlurals(row?.duration, 'day')}</StyledTableCell>
                    <StyledTableCell>
                      <div
                        style={{
                          backgroundColor: row?.color,
                          height: 20,
                          width: 20,
                          borderRadius: 5,
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ display: 'flex' }}>
                      {!switchedValue ? (
                        <IconButton onClick={() => handleOpen({ data: row, add: false })}>
                          <Edit style={{ fontSize: 25, color: '#627daf' }} />
                        </IconButton>
                      ) : (
                        ''
                      )}
                      <IconButton onClick={() => handleOpenConfirm(row)}>
                        <img
                          src={ArchiveIcon}
                          onMouseOver={(e) => (e.currentTarget.src = ArchiveDanger)}
                          onMouseOut={(e) => (e.currentTarget.src = ArchiveIcon)}
                          style={{ width: 20, height: 20 }}
                        />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ),
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <EditType
        open={open}
        handleClose={handleClose}
        editData={editData}
        forAdd={isAdd}
        handleForm={handleOpen}
      />
      <ConfirmationDialog
        open={confirm}
        archive={switchedValue}
        handleClose={handleCloseConfirm}
        archiveData={editData}
      />
    </>
  );
}

export default React.memo(TaskTypaTable);
