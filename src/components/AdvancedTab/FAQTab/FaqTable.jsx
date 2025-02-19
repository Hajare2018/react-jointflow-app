import {
  Fab,
  FormControlLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import { Add, Edit, Info, RefreshRounded } from '@mui/icons-material';
import PropTypes from 'prop-types';
import SearchBar from '../../../component-lib/SearchBar/SearchBar';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allFaqs, fetchSingleFaq, updateFaq } from '../../../Redux/Actions/feedback';
import { show } from '../../../Redux/Actions/loader';
import ArchiveIcon from '../../../assets/icons/archive.png';
import ArchiveDanger from '../../../assets/icons/archive_danger.png';
import { Alert } from '@mui/material';
import { formatDateTime } from '../../Utils';
import AddFaqs from './AddFaqs';
import ConfirmDialog from '../../ProjectForm/Components/ConfirmDialog';
import { stableSort, getComparator } from '../../../component-lib/JFTable/JFTable';

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'text_content', numeric: false, disablePadding: false, label: 'Contents' },
  { id: 'link_url', numeric: false, disablePadding: false, label: 'Links' },
  { id: 'hide', numeric: false, disablePadding: false, label: 'Hidden' },
  { id: 'display_order', numeric: false, disablePadding: false, label: 'Display Order' },
  { id: 'important', numeric: false, disablePadding: false, label: 'Important' },
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
    maxHeight: `calc(100vh - 278px)`,
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

function FaqTable() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [switchedValue, setSwitchedValue] = useState(false);
  const [archiveData, setArchiveData] = useState(null);
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [doArchive, setDoArchive] = useState(false);
  const [searched, setSearched] = useState('');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [rows, setRows] = useState([]);
  const loader = useSelector((state) => state?.showLoader);

  const faqsData = useSelector((state) => state.faqsData);
  const faqs = faqsData?.data?.length > 0 ? faqsData?.data : [];
  const unArchivedFaqs = faqs?.filter((item) => item.archive === false);
  const archivedFaqs = faqs?.filter((item) => item.archive === true);

  useEffect(() => {
    doRefresh();
  }, []);

  const doRefresh = () => {
    dispatch(show(true));
    dispatch(allFaqs({ all: true }));
  };

  useEffect(() => {
    setSearched('');
    if (switchedValue) {
      setRows(archivedFaqs);
    } else {
      setRows(unArchivedFaqs);
    }
  }, [faqsData]);

  const handleSwitch = () => {
    setSwitchedValue(!switchedValue);
    if (switchedValue) {
      setRows(unArchivedFaqs);
    } else {
      setRows(archivedFaqs);
    }
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = (rows || [])?.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
    if (searchedVal === '') {
      //   setRows(switchedValue ? archivedAttributes : unArchivedAttributes)
    }
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
    // setRows(switchedValue ? archivedAttributes : unArchivedAttributes)
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFaqForm = (e) => {
    setSearched('');
    setOpen(true);
    if (e.edit) {
      setAdd(false);
      dispatch(fetchSingleFaq({ id: e.id }));
    } else {
      setAdd(true);
    }
  };
  const handleCloseFaqForm = () => {
    setOpen(false);
  };

  const handleArchiveDialog = (e) => {
    e.archive ? setDoArchive(true) : setDoArchive(false);
    setArchiveData(e.data);
    setOpenArchive(true);
  };

  const handleArchive = (e) => {
    if (e.close) {
      dispatch(show(true));
      const reqBody = {
        archive: doArchive,
      };
      dispatch(updateFaq({ data: reqBody, id: archiveData?.id }));
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

  return (
    <div>
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
            label={<span>{switchedValue ? 'Hide Archived FAQs' : 'Display Archived FAQs'}</span>}
          />
        </div>
        {!switchedValue && (
          <div style={{ float: 'right' }}>
            <Tooltip
              title="Add New FAQs"
              placement="top"
              arrow
            >
              <Fab
                size="small"
                onClick={handleFaqForm}
                style={{ backgroundColor: '#627daf', color: '#ffffff' }}
              >
                <Add style={{ height: 30, width: 30 }} />
              </Fab>
            </Tooltip>
          </div>
        )}
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
      {rows?.length > 0 ? (
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
                        style={{
                          color: !row.archive ? '#627daf' : '#aeaeae',
                          cursor: !row.archive ? 'pointer' : '',
                        }}
                      >
                        {row?.name?.length > 25
                          ? row?.name.substring(0, 25 - 3) + '...'
                          : row?.name}
                      </strong>
                    </StyledTableCell>
                    <Tooltip
                      title={<Alert>{row?.text_content}</Alert>}
                      placement="top"
                      arrow
                    >
                      <StyledTableCell style={{ color: !row?.archive ? '#000000' : '#aeaeae' }}>
                        {row?.text_content?.length > 25
                          ? row.text_content.substring(0, 25 - 3) + '...'
                          : row?.text_content}
                      </StyledTableCell>
                    </Tooltip>
                    <StyledTableCell style={{ color: !row?.archive ? '#000000' : '#aeaeae' }}>
                      <a
                        href={row?.link_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {row?.link_url?.length > 25
                          ? row.link_url.substring(0, 25 - 3) + '...'
                          : row?.link_url}
                      </a>
                    </StyledTableCell>
                    <StyledTableCell style={{ color: !row?.archive ? '#000000' : '#aeaeae' }}>
                      {row?.hide ? 'Yes' : 'No'}
                    </StyledTableCell>
                    <StyledTableCell style={{ color: !row?.archive ? '#000000' : '#aeaeae' }}>
                      {row?.display_order}
                    </StyledTableCell>
                    <StyledTableCell style={{ color: !row?.archive ? '#000000' : '#aeaeae' }}>
                      {row?.important ? 'Yes' : 'No'}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 2,
                        height: 30,
                      }}
                    >
                      {!row?.archive && (
                        <div
                          className="mr-4"
                          onClick={() => handleFaqForm({ edit: true, id: row?.id })}
                        >
                          <Edit style={{ fontSize: 25, color: '#627daf' }} />
                        </div>
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
                          placement="top"
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
      ) : (
        <div className="text-centre">
          <strong>No Record(s) found!</strong>
        </div>
      )}
      <AddFaqs
        open={open}
        handleClose={handleCloseFaqForm}
        forAdd={add}
      />
      {openArchive && (
        <ConfirmDialog
          open={openArchive}
          handleClose={handleArchive}
          dialogContent={
            doArchive
              ? 'Are you sure, you want to archive this FAQ?'
              : 'Are you sure, you want to unarchive this FAQ?'
          }
          dialogTitle={doArchive ? 'Archive FAQ' : 'UnArchive FAQ'}
        />
      )}
    </div>
  );
}

export default React.memo(FaqTable);
