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
import { show } from '../../../Redux/Actions/loader';
import Loader from '../../Loader';
import { Add, Edit, Info, RefreshRounded } from '@mui/icons-material';
import { Fab, FormControlLabel, IconButton, Switch, TableSortLabel, Tooltip } from '@mui/material';
import '../../Documents/DocumentsLibrary/document.css';
import { withStyles } from '@mui/styles';
import ArchiveIcon from '../../../assets/icons/archive.png';
import ArchiveDanger from '../../../assets/icons/archive_danger.png';
import SearchBar from '../../../component-lib/SearchBar/SearchBar';
import {
  editTenantAttributes,
  requestTenantAttributes,
  requestTenantDataByName,
} from '../../../Redux/Actions/user-info';
import { formatDateTime } from '../../Utils';
import AddTenantAttributes from './AddTenantAttributes';
import { Alert } from '@mui/material';
import ConfirmDialog from '../../ProjectForm/Components/ConfirmDialog';
import { stableSort, getComparator } from '../../../component-lib/JFTable/JFTable';

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
  { id: 'value_text', numeric: false, disablePadding: false, label: 'Text' },
  {
    id: 'value_datetime',
    numeric: false,
    disablePadding: false,
    label: 'DateTime',
  },
  { id: 'value_int', numeric: false, disablePadding: false, label: 'Int' },
  { id: 'value_bool', numeric: false, disablePadding: false, label: 'Bool' },
  { id: '', numeric: false, disablePadding: false, label: 'Actions' },
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
    maxHeight: `calc(100vh - 318px)`,
  },
});

const StyledTableCell = withStyles(() => ({
  head: {
    color: '#000000',
    fontWeight: '700 !important',
  },
  root: {
    borderBottom: `0px !important`,
    padding: `8px !important`,
  },
  body: {
    fontSize: 16,
    height: 20,
    padding: 8,
    width: 'auto',
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

function TenantAttributesList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [switchedValue, setSwitchedValue] = React.useState(false);
  const [archiveData, setArchiveData] = useState(null);
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [doArchive, setDoArchive] = useState(false);
  const [searched, setSearched] = useState('');
  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('end_date');

  const handleAttributesCreation = (e) => {
    setSearched('');
    setOpen(true);
    if (e.edit) {
      setAdd(false);
      dispatch(requestTenantDataByName({ keyword: e.id.name }));
    } else {
      setAdd(true);
    }
  };

  const handleClose = () => setOpen(false);

  const tenantAttributes = useSelector((state) => state?.tenantAttributesData);
  const archivedAttributes =
    tenantAttributes?.data?.length > 0
      ? tenantAttributes?.data?.filter((item) => item.archive === true)
      : [];
  const unArchivedAttributes =
    tenantAttributes?.data?.length > 0
      ? tenantAttributes?.data?.filter((item) => item.archive === false || item.archive === null)
      : [];
  const loader = useSelector((state) => state?.showLoader);
  useEffect(() => {
    doRefresh();
  }, []);

  useEffect(() => {
    setSearched('');
    if (switchedValue) {
      setRows(archivedAttributes);
    } else {
      setRows(unArchivedAttributes);
    }
  }, [tenantAttributes]);

  const doRefresh = () => {
    dispatch(show(true));
    dispatch(requestTenantAttributes());
  };

  const handleArchiveDialog = (e) => {
    e.archive ? setDoArchive(true) : setDoArchive(false);
    setArchiveData(e.data);
    setOpenArchive(true);
  };

  const handleArchive = (e) => {
    if (e.close) {
      dispatch(show(true));
      const formData = new FormData();
      formData.append('archive', doArchive);
      dispatch(
        editTenantAttributes({
          data: formData,
          attribute_name: archiveData?.name,
        }),
      );
      if (!loader.show) {
        closeArchiveDialog();
      }
    } else {
      closeArchiveDialog();
    }
  };

  const closeArchiveDialog = () => {
    setOpenArchive(false);
  };

  const handleSwitch = () => {
    setSwitchedValue(!switchedValue);
    if (switchedValue) {
      setRows(unArchivedAttributes);
    } else {
      setRows(archivedAttributes);
    }
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = (rows || [])?.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
    if (searchedVal == '') {
      setRows(switchedValue ? archivedAttributes : unArchivedAttributes);
    }
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
    setRows(switchedValue ? archivedAttributes : unArchivedAttributes);
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
                {switchedValue
                  ? 'Hide Archived System Settings'
                  : 'Display Archived System Settings'}
              </span>
            }
          />
        </div>
        <div style={{ float: 'right' }}>
          <Tooltip
            title="Add New System Settings"
            placement="top"
            arrow
          >
            <Fab
              size="small"
              onClick={handleAttributesCreation}
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
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows?.length > 0 ? rows : [], getComparator(order, orderBy)).map(
                (row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell scope="row">
                      <strong
                        onClick={() => {
                          !row?.archive &&
                            handleAttributesCreation({
                              edit: true,
                              id: row,
                            });
                        }}
                        style={{
                          color: !row?.archive ? '#627daf' : '#aeaeae',
                          cursor: !row?.archive ? 'pointer' : '',
                        }}
                      >
                        {row?.name?.length > 25 ? row.name.substring(0, 25 - 3) + '...' : row?.name}
                      </strong>
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        color: !row?.archive ? '#000000' : '#aeaeae',
                      }}
                    >
                      {row?.type}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        color: !row?.archive ? '#000000' : '#aeaeae',
                      }}
                    >
                      {row?.value_text?.length > 25
                        ? row.value_text.substring(0, 25 - 3) + '...'
                        : row?.value_text}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        color: !row?.archive ? '#000000' : '#aeaeae',
                      }}
                    >
                      {row?.value_datetime !== null
                        ? formatDateTime(new Date(row?.value_datetime), 'ddd h:mmtt d MMM yyyy')
                        : ''}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        color: !row?.archive ? '#000000' : '#aeaeae',
                      }}
                    >
                      {row?.value_int}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        color: !row?.archive ? '#000000' : '#aeaeae',
                      }}
                    >
                      {row?.type === 'Bool' && (row?.value_bool ? 'True' : 'False')}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 2,
                        height: 30,
                      }}
                    >
                      {!row?.archive ? (
                        <div
                          className="mr-4"
                          onClick={() =>
                            handleAttributesCreation({
                              edit: true,
                              id: row,
                            })
                          }
                        >
                          <Edit style={{ fontSize: 25, color: '#627daf' }} />
                        </div>
                      ) : (
                        ''
                      )}
                      <div
                        onClick={() =>
                          handleArchiveDialog({
                            archive: row?.archive ? false : true,
                            data: row,
                          })
                        }
                        className="mr-4"
                      >
                        <img
                          src={ArchiveIcon}
                          onMouseOver={(e) => (e.currentTarget.src = ArchiveDanger)}
                          onMouseOut={(e) => (e.currentTarget.src = ArchiveIcon)}
                          style={{ width: 20, height: 20 }}
                        />
                      </div>
                      <div>
                        <Tooltip
                          title={
                            <Alert severity="info">
                              <ul>
                                <li>
                                  <strong>Created by:</strong>{' '}
                                  {row?.created_by_details === null
                                    ? 'NA'
                                    : row?.created_by_details?.first_name +
                                      ' ' +
                                      row?.created_by_details?.last_name +
                                      ' on ' +
                                      formatDateTime(
                                        new Date(row?.created_at),
                                        'ddd h:mmtt d MMM yyyy',
                                      )}
                                </li>
                                <li>
                                  <strong>Updated by:</strong>{' '}
                                  {row?.updated_by_details === null
                                    ? 'NA'
                                    : row?.updated_by_details?.first_name +
                                      ' ' +
                                      row?.updated_by_details?.last_name +
                                      ' on ' +
                                      formatDateTime(
                                        new Date(row?.updated_at),
                                        'ddd h:mmtt d MMM yyyy',
                                      )}
                                </li>
                              </ul>
                            </Alert>
                          }
                          placement="left"
                          arrow
                        >
                          <Info style={{ fontSize: 25, color: '#627daf' }} />
                        </Tooltip>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ),
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <AddTenantAttributes
        open={open}
        forAdd={add}
        handleClose={handleClose}
      />
      {openArchive && (
        <ConfirmDialog
          open={openArchive}
          handleClose={handleArchive}
          dialogContent={
            doArchive
              ? 'Are you sure, you want to archive this system setting?'
              : 'Are you sure, you want to unarchive this system setting?'
          }
          dialogTitle={doArchive ? 'Archive System Setting' : 'UnArchive System Setting'}
        />
      )}
    </>
  );
}

export default React.memo(TenantAttributesList);
