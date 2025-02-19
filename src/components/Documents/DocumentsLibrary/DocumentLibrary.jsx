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
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { timeAgo } from '../../../components/Utils';
import SearchBar from '../../../component-lib/SearchBar/SearchBar';
import {
  getDocsList,
  requestClauseList,
  updateDocument,
} from '../../../Redux/Actions/document-upload';
import { show } from '../../../Redux/Actions/loader';
import {
  Badge,
  Button,
  Fab,
  FormControlLabel,
  Radio,
  Switch,
  TablePagination,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, Ballot, Edit, RefreshRounded } from '@mui/icons-material';
import ArchiveIcon from '../../../assets/icons/archive.png';
import ArchiveDanger from '../../../assets/icons/archive_danger.png';
import AddDocuments from './AddDocuments';
import { cloneDocument } from '../../../Redux/Actions/clone-data';
import ConfirmDialog from '../../ProjectForm/Components/ConfirmDialog';
import { defaultStyles, FileIcon } from 'react-file-icon';
import HttpClient from '../../../Api/HttpClient';
import ClausesList from '../../ProjectForm/Components/ClausesList';
import Loader from '../../Loader';
import { stableSort, getComparator } from '../../../component-lib/JFTable/JFTable';

function EnhancedTableHead({ classes, order, orderBy, onRequestSort, clone }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    {
      id: 'document_type',
      numeric: false,
      disablePadding: false,
      label: 'Type',
    },
    {
      id: 'category',
      numeric: false,
      disablePadding: false,
      label: 'Category',
    },
    { id: 'version', numeric: true, disablePadding: false, label: 'Version' },
    { id: 'nb_pages', numeric: true, disablePadding: false, label: 'Pages' },
    {
      id: 'created_at',
      numeric: true,
      disablePadding: false,
      label: 'Created',
    },
  ];

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
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
        {!clone && <StyledTableCell align="right">Actions</StyledTableCell>}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

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

const EnhancedTableToolbar = ({ selected, cardId, close, forTaskTypes }) => {
  const classes = useToolbarStyles();
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const handleSaveDocument = () => {
    const requestBody = {
      library_id: selected.id,
      card_id: cardId,
    };
    const requestBodyForTaskType = {
      library_id: selected.id,
      task_type_id: cardId,
    };
    dispatch(show(true));
    dispatch(
      cloneDocument({
        data: forTaskTypes ? requestBodyForTaskType : requestBody,
        cloneByTaskType: forTaskTypes,
      }),
    );
    if (!loader.show) {
      close();
    }
  };
  return (
    <Toolbar
      style={{ display: 'flex' }}
      className={clsx(classes.root, {
        [classes.highlight]: selected.name,
      })}
    >
      {selected.name && (
        <div style={{ width: '100%', padding: 10 }}>
          <Typography
            style={{ float: 'left' }}
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selected.name} selected
          </Typography>
          <Button
            variant="contained"
            onClick={handleSaveDocument}
            style={{
              backgroundColor: '#6385b7',
              color: '#ffffff',
              fontSize: 16,
              float: 'right',
            }}
          >
            NEXT
          </Button>
        </div>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const StyledTableCell = withStyles((_theme) => ({
  head: {
    color: '#000000',
    fontWeight: '700',
  },
  root: {
    borderBottom: `0px !important`,
    padding: `8px !important`,
  },
  body: {
    fontSize: 16,
    height: 50,
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
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: 'rgba(183, 244, 216, 0.7)',
    },
  },
}))(TableRow);

const useStyles = makeStyles((_theme) => ({
  table: {
    minWidth: '100%',
    height: 40,
  },
  root: {
    width: '100%',
  },
  container: {
    maxHeight: `calc(100vh - 278px)`,
  },
  fab: {
    backgroundColor: '#627daf',
    margin: 0,
    top: 'auto',
    right: 80,
    bottom: 50,
    left: 'auto',
    position: 'fixed',
    '&:hover': {
      backgroundColor: '#4bdcba',
    },
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function DocumentLibrary({ clone, card_id, closeModal, forTaskTypes }) {
  let env = HttpClient.environment;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('created_at');
  const [archived, setArchived] = useState(false);
  const [documentTemplates, setDocumentTemplates] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = React.useState('');
  const [searched, setSearched] = useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [docData, setDocData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [showClauses, setShowClauses] = useState(false);
  const [docId, setDocId] = useState(null);
  const [category, setCategory] = useState('Default');
  const [data, setData] = React.useState({});
  const loader = useSelector((state) => state.showLoader);
  const allDocs = useSelector((state) => state.uploadedDocs);
  const noDataMessage = useSelector((state) => state.messageData);
  const categories = allDocs?.data?.categories;

  useEffect(() => {
    const isTemplate =
      allDocs?.data?.documents?.length > 0 &&
      allDocs?.data?.documents?.filter((item) => item.is_template === true);
    setDocumentTemplates(isTemplate);
    setSearched('');
    setRows(isTemplate);
  }, [archived, allDocs]);

  React.useEffect(() => {
    doRefresh();
  }, []);

  const handleCategory = (event) => {
    setCategory(event.target.value);
    getDocByCategory(event.target.value);
  };

  const getDocByCategory = (category) => {
    const filtered =
      allDocs?.data?.documents?.length > 0 &&
      allDocs?.data?.documents?.filter((item) => item.category == category);
    setRows(filtered);
    setDocumentTemplates(filtered);
    return filtered;
  };

  const doRefresh = () => {
    dispatch(show(true));
    if (archived) {
      dispatch(
        getDocsList({
          id: null,
          isTemplate: true,
          archived: true,
          categories: true,
        }),
      );
    } else {
      dispatch(
        getDocsList({
          id: null,
          isTemplate: true,
          archived: false,
          categories: true,
        }),
      );
    }
  };

  const handleClick = (event, data) => {
    let newSelected = selected;
    if (data.id !== selected) {
      newSelected = data.id;
      setDocData(data);
    }
    setSelected(newSelected);
  };

  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  useEffect(() => {
    setArchived(archived);
  }, [archived]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = (documentTemplates || []).filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    if (filteredRows?.length > 0) {
      setRows(filteredRows);
    } else {
      setRows([]);
    }
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };

  const handleOpen = (e) => {
    setData(e);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleArchive = (e) => {
    setDocData(e);
    setOpenDialog(!openDialog);
  };

  const handleCloseDialog = (e) => {
    if (e.close) {
      handleArchiveDocument();
    }
    setOpenDialog(!openDialog);
  };

  const handleArchiveDocument = () => {
    const formData = new FormData();
    formData.append('name', docData?.name);
    formData.append(
      'document_type',
      env === 'staging' ? docData?.task_type_details?.id : docData?.document_type_details?.id,
    );
    formData.append('archived', docData?.archived ? 'False' : 'True');
    dispatch(show(true));
    dispatch(
      updateDocument({
        id: docData?.id,
        card_id: docData?.card,
        board_id: docData?.board,
        data: formData,
        archived: false,
        refresh: true,
      }),
    );
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const isSelected = (id) => {
    return selected === id;
  };

  const handleSwitch = () => {
    dispatch(show(true));
    if (archived) {
      dispatch(
        getDocsList({
          id: null,
          isTemplate: true,
          archived: false,
          categories: true,
        }),
      );
    } else {
      dispatch(
        getDocsList({
          id: null,
          isTemplate: true,
          archived: true,
          categories: true,
        }),
      );
    }
    setArchived(!archived);
  };
  const handleShowClauses = (e) => {
    setDocId(e.id);
    dispatch(requestClauseList({ doc_id: e.id, hidden: false }));
    setShowClauses(true);
  };

  return (
    <>
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
          <div className="selectbox selectbox-m d-flex">
            <label
              className="form-label"
              style={{ width: 120, color: '#222' }}
            >
              Filter by:
            </label>
            <select
              className="text-input"
              style={{ color: '#000000' }}
              value={category}
              onChange={handleCategory}
            >
              <option
                value="Category"
                disabled
                aria-disabled
              >
                Category
              </option>
              {categories?.map((item) => (
                <option
                  key={item.category}
                  value={item.category}
                >
                  {item.category}
                </option>
              ))}
            </select>
          </div>
          {!clone && (
            <>
              <div style={{ float: 'left' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={archived}
                      onChange={handleSwitch}
                    />
                  }
                  label={<span>{!archived ? 'Show' : 'Hide'} Archived Documents</span>}
                />
              </div>
              <div style={{ float: 'right' }}>
                <Tooltip
                  title="Add New Documents"
                  placement="top"
                  arrow
                >
                  <Fab
                    size="small"
                    onClick={() => handleOpen({ add_template: true })}
                    style={{
                      backgroundColor: '#627daf',
                      color: '#ffffff',
                      fontSize: 16,
                      textTransform: 'none',
                    }}
                  >
                    <Add style={{ height: 30, width: 30 }} />
                  </Fab>
                </Tooltip>
              </div>
              {/* } */}
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
            </>
          )}
        </div>
        {loader.show ? (
          <Loader />
        ) : rows.length > 0 ? (
          <TableContainer className={classes.container}>
            <Table
              className={`${classes.table} porjectTable`}
              size="medium"
              aria-label="enhanced table"
              stickyHeader
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                clone={clone}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows.length > 0 ? rows : [], getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <StyledTableRow
                        onClick={(event) => {
                          clone && handleClick(event, row);
                        }}
                        role={clone && 'checkbox'}
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <StyledTableCell
                          id={labelId}
                          style={{ width: 'auto', display: 'flex' }}
                          padding={clone ? 'checkbox' : 'none'}
                        >
                          {clone && (
                            <Radio
                              checked={isItemSelected}
                              color="success"
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          )}
                          <div className="file-icons">
                            <div className="file-icon">
                              <FileIcon
                                size={15}
                                extension={row?.extension}
                                {...defaultStyles[row?.extension]}
                              />
                            </div>
                            <strong>
                              {(row?.name).length > 25
                                ? (row?.name).substring(0, 25 - 3) + '...'
                                : row?.name}
                            </strong>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row?.document_type_details?.custom_label}
                        </StyledTableCell>
                        <StyledTableCell align="left">{row?.category}</StyledTableCell>
                        <StyledTableCell align="right">{row?.version}</StyledTableCell>
                        <StyledTableCell align="right">
                          {row?.nb_pages === null ? 0 : row?.nb_pages}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {timeAgo(new Date(row?.created_at).getTime())}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {!clone && !archived && (
                            <>
                              <IconButton
                                onClick={() =>
                                  handleOpen({
                                    edit_template: true,
                                    library_id: row.id,
                                    name: row.name,
                                    document_type: row?.document_type_details?.id,
                                    category: row?.category,
                                    file: row?.document_url,
                                    size: row?.size,
                                    version: row?.version,
                                    change_percent: row?.change_percent,
                                    created_at: row?.created_at,
                                    is_template: row?.is_template,
                                    archived: row?.archived,
                                  })
                                }
                              >
                                <Edit style={{ fontSize: 25, color: '#627daf' }} />
                              </IconButton>
                              {row?.extracted_clauses?.length > 0 && (
                                <Tooltip
                                  title={'Clauses'}
                                  placement="top"
                                  arrow
                                >
                                  <IconButton onClick={() => handleShowClauses(row)}>
                                    {row?.extracted_clauses?.[0]?.nb_clauses < 99 ? (
                                      <Badge
                                        badgeContent={row?.extracted_clauses?.[0]?.nb_clauses}
                                        style={{ fontSize: 12 }}
                                        color={'secondary'}
                                      >
                                        <Ballot
                                          style={{
                                            color: '#627daf',
                                            height: 30,
                                            width: 30,
                                          }}
                                        />
                                      </Badge>
                                    ) : (
                                      <Ballot
                                        style={{
                                          color: '#627daf',
                                          height: 30,
                                          width: 30,
                                        }}
                                      />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              )}
                            </>
                          )}
                          <IconButton onClick={() => handleArchive(row)}>
                            <img
                              src={ArchiveIcon}
                              onMouseOver={(e) => (e.currentTarget.src = ArchiveDanger)}
                              onMouseOut={(e) => (e.currentTarget.src = ArchiveIcon)}
                              style={{ width: 20, height: 20 }}
                            />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className="text-centre">
            <strong>{noDataMessage.message}</strong>
          </div>
        )}
        {selected ? (
          <EnhancedTableToolbar
            selected={docData}
            searched={searched}
            requestSearch={requestSearch}
            cancelSearch={cancelSearch}
            clone={clone}
            cardId={card_id}
            close={closeModal}
            forTaskTypes={forTaskTypes}
          />
        ) : (
          documentTemplates?.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={documentTemplates?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )
        )}
      </div>
      <AddDocuments
        open={open}
        data={data}
        handleClose={handleClose}
        categories={categories}
      />
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          dialogTitle={docData?.archived ? 'UnArchive this document!' : 'Archive this document!'}
          dialogContent={
            docData?.archived
              ? 'Are you sure to unarchive this document?'
              : 'Are you sure to archive this document?'
          }
        />
      )}
      <ClausesList
        doc_id={{ id: docId }}
        open={showClauses}
        handleClose={() => setShowClauses(false)}
      />
    </>
  );
}

export default React.memo(DocumentLibrary);
