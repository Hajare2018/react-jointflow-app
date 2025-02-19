import React, { useCallback, useMemo, useState } from 'react';
import { withStyles, makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Badge, Box, Chip, Collapse, IconButton, Tooltip } from '@mui/material';
import { grey } from '@mui/material/colors';
import { formatDateTime, groupBy, makePlurals, reverseArr } from '../../Utils';
import ArchiveIcon from '../../../assets/icons/archive.png';
import ArchiveDanger from '../../../assets/icons/archive_danger.png';
import ConfirmDialog from './ConfirmDialog';
import { setMessage, show } from '../../../Redux/Actions/loader';
import { requestClauseList, updateDocument } from '../../../Redux/Actions/document-upload';
import { useDispatch } from 'react-redux';
import { FaComment, FaRegFileAlt } from 'react-icons/fa';
import { defaultStyles, FileIcon } from 'react-file-icon';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  BallotOutlined,
  InsertDriveFileOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  LaunchOutlined,
  LibraryBooksOutlined,
  Warning,
} from '@mui/icons-material';
import { Alert } from '@mui/material';
import DocumentDetails from './DocumentDetails/DocumentDetails';
import { fetchData } from '../../../Redux/Actions/store-data';
import { useUserContext } from '../../../context/UserContext';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: grey,
    color: theme.palette.common.black,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    borderBottom: 0,
    padding: `5px !important`,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
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
      maxHeight: `58vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `48vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `45vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `37vh`,
    },
  },
  forDashboard: {
    maxHeight: 'auto',
  },
});

function Row({
  row,
  api_token,
  toggleComments,
  toggleDialog,
  toggleTrackings,
  toggleClauses,
  forBoard,
}) {
  const reversedArr = reverseArr(row);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleOpenTask = (board, card) => {
    window.open(`/board/?id=${board}&navbars=True&actions=True&card=${card}`, '_blank');
  };

  return (
    <React.Fragment>
      <StyledTableRow>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className="row-expand"
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell
          style={{
            color: '#627daf',
            fontWeight: '700',
            width: '100%',
          }}
        >
          <div className="file-icons">
            <div
              className="file-icon"
              style={{ WebkitFontSmoothing: 'antialiased' }}
            >
              <FileIcon
                extension={row?.original_doc?.extension}
                {...defaultStyles[row?.original_doc?.extension]}
              />
            </div>
            <a
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
                marginRight: 5,
              }}
              href={row?.original_doc?.document_url + `/${api_token}/`}
            >
              {(row?.original_doc?.name).length > 25
                ? (row?.original_doc?.name).substring(0, 25 - 3) + '...'
                : row?.original_doc?.name}
            </a>
            {forBoard && (
              <Tooltip title={`Open ${'Task: ' + row?.original_doc?.card_name} in New Tab`}>
                <Chip
                  label={'Task: ' + row?.original_doc?.card_name}
                  icon={<LaunchOutlined className="app-color h-4 w-4 ml-2" />}
                  onClick={() => handleOpenTask(row?.[0]?.board, row?.[0]?.card)}
                  clickable
                  variant="outlined"
                  size="small"
                  style={{
                    color: '#627daf',
                  }}
                />
              </Tooltip>
            )}
          </div>
        </StyledTableCell>
        <StyledTableCell>
          <div className="mr-3">
            <button
              onClick={() => toggleTrackings(reversedArr?.[0])}
              className="view-doc-btn"
            >
              View
            </button>
          </div>
          {row?.created_from_template && (
            <Tooltip
              title="This document is uploaded from library."
              placement="top"
            >
              <LibraryBooksOutlined style={{ color: '#627daf', height: 30, width: 30 }} />
            </Tooltip>
          )}
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell
          style={{ padding: 0 }}
          colSpan={4}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 1 }}>
              <Table
                size="small"
                aria-label="documents"
              >
                <TableBody>
                  {(reversedArr || []).map((item) => (
                    <StyledTableRow key={item?.id}>
                      <StyledTableCell />
                      <StyledTableCell />
                      <StyledTableCell
                        style={{
                          color: '#627daf',
                          fontWeight: '700',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        <div className="file-icons">
                          <Tooltip
                            title={
                              <Alert severity={'info'}>
                                {'DOCX_modified_at' in item?.document_properties ? (
                                  <ul>
                                    <strong>
                                      {item?.created_from_template ? 'From Library.' : ''}
                                    </strong>
                                    <li>Last Modified:</li>
                                    <ul style={{ listStyle: 'inside' }}>
                                      <li>{item?.document_properties?.DOCX_last_modified_by}</li>
                                      <li>
                                        {formatDateTime(
                                          new Date(item?.document_properties?.DOCX_modified_at),
                                          'ddd h:mmtt d MMM yyyy',
                                        )}
                                      </li>
                                    </ul>
                                    <li>
                                      Word count:{' '}
                                      {Object.keys(item?.document_properties).length === 0
                                        ? 'NA'
                                        : item?.document_properties?.word_count}
                                    </li>
                                    <li>
                                      Pages:{' '}
                                      {Object.keys(item?.document_properties).length === 0
                                        ? 'NA'
                                        : item?.document_properties?.nb_pages}
                                    </li>
                                    {(item?.document_properties?.inserted_text?.length > 0 ||
                                      item?.document_properties?.deleted_text?.length > 0) && (
                                      <>
                                        <li>
                                          Insertions:{' '}
                                          {Object.keys(item?.document_properties).length === 0
                                            ? 'NA'
                                            : item?.document_properties?.inserted_text?.length +
                                              '(' +
                                              makePlurals(
                                                item?.document_properties?.inserted_words,
                                                'word',
                                              ) +
                                              ')'}
                                        </li>
                                        <li>
                                          Deletions:{' '}
                                          {Object.keys(item?.document_properties).length === 0
                                            ? 'NA'
                                            : item?.document_properties?.deleted_text?.length +
                                              '(' +
                                              makePlurals(
                                                item?.document_properties?.deleted_words,
                                                'word',
                                              ) +
                                              ')'}
                                        </li>
                                      </>
                                    )}
                                  </ul>
                                ) : (
                                  <ul>
                                    <li>
                                      <strong>
                                        {item?.created_from_template ? 'From Library.' : ''}
                                      </strong>
                                    </li>
                                    <li>
                                      Word count:{' '}
                                      {Object.keys(item?.document_properties).length === 0
                                        ? 'NA'
                                        : item?.document_properties?.word_count}
                                    </li>
                                    <li>
                                      Pages:{' '}
                                      {Object.keys(item?.document_properties).length === 0
                                        ? 'NA'
                                        : item?.document_properties?.nb_pages}
                                    </li>
                                  </ul>
                                )}
                              </Alert>
                            }
                            placement="left"
                            arrow
                          >
                            <a
                              href={item?.document_url + `/${api_token}/`}
                              style={{ paddingRight: 10 }}
                            >
                              V
                              {item?.version?.toString().length > 10
                                ? item?.version?.toString()?.substring(0, 10 - 3) + '...'
                                : item?.version}
                            </a>
                          </Tooltip>
                          {item?.warning && item?.warning_text !== null && (
                            <Tooltip
                              title={<Alert severity={'warning'}>{item?.warning_text}</Alert>}
                              placement="top"
                              arrow
                            >
                              <Warning style={{ color: 'orange' }} />
                            </Tooltip>
                          )}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {new Date(item?.created_at).toLocaleDateString()}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item?.created_by_details?.first_name == undefined
                          ? ' '
                          : item?.created_by_details?.first_name +
                            ' ' +
                            item?.created_by_details?.last_name}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className="d-flex"
                      >
                        <div className="d-flex mr-3">
                          <div style={{ height: 35, width: 35, marginRight: 8 }}>
                            <CircularProgressbarWithChildren value={item?.change_percent}>
                              <Tooltip
                                title={
                                  item?.change_percent === null ? '0%' : item?.change_percent + '%'
                                }
                                placement="top"
                                arrow
                              >
                                <div style={{ fontSize: 8, color: '#627daf' }}>
                                  <strong>
                                    {item?.change_percent === null
                                      ? '-'
                                      : Math.round(item?.change_percent) + '%'}
                                  </strong>
                                </div>
                              </Tooltip>
                            </CircularProgressbarWithChildren>
                          </div>
                          <Tooltip
                            title={makePlurals(
                              item?.nb_pages === null ? '0' : item?.nb_pages,
                              'page',
                            )}
                            placement="top"
                            arrow
                          >
                            <div className="image">
                              <InsertDriveFileOutlined
                                style={{
                                  color: item?.nb_pages === null ? '#aeaeae' : '#627daf',
                                  height: 37,
                                  width: 37,
                                }}
                              />
                              <p>
                                <span>{item?.nb_pages === null ? '0' : item?.nb_pages}</span>
                              </p>
                            </div>
                          </Tooltip>
                        </div>
                        <div className="d-flex ml-3">
                          <Tooltip
                            title={'Change Tracking'}
                            placement="top"
                            arrow
                          >
                            {item?.document_properties?.inserted_text?.length > 0 ||
                            item?.document_properties?.deleted_text?.length > 0 ? (
                              <div
                                onClick={() => toggleTrackings(item)}
                                className="m-1 mr-3 track-changes"
                              >
                                <Badge
                                  badgeContent={
                                    item?.document_properties?.inserted_text?.length +
                                    item?.document_properties?.deleted_text?.length
                                  }
                                  classes={classes.root}
                                  color={'secondary'}
                                >
                                  <FaRegFileAlt
                                    style={{
                                      color: '#627daf',
                                      height: 30,
                                      width: 30,
                                    }}
                                  />
                                </Badge>
                              </div>
                            ) : (
                              <div className="mr-3">
                                <FaRegFileAlt
                                  style={{
                                    color: '#aeaeae',
                                    height: 30,
                                    width: 30,
                                  }}
                                />
                              </div>
                            )}
                          </Tooltip>
                          {item?.extracted_clauses?.length > 0 ? (
                            <Tooltip
                              title={'Clauses'}
                              placement="top"
                              arrow
                            >
                              <div
                                onClick={() => toggleClauses(item)}
                                className="m-1 mr-3"
                              >
                                {item?.extracted_clauses?.[0]?.nb_clauses < 99 ? (
                                  <Badge
                                    badgeContent={item?.extracted_clauses?.[0]?.nb_clauses}
                                    classes={classes.root}
                                    style={{ color: '#222222' }}
                                  >
                                    <BallotOutlined
                                      style={{
                                        color: '#627daf',
                                        height: 30,
                                        width: 30,
                                      }}
                                    />
                                  </Badge>
                                ) : (
                                  <BallotOutlined
                                    style={{
                                      color: '#627daf',
                                      height: 30,
                                      width: 30,
                                    }}
                                  />
                                )}
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="mr-3">
                              <BallotOutlined
                                style={{
                                  color: '#aeaeae',
                                  height: 30,
                                  width: 30,
                                }}
                              />
                            </div>
                          )}
                          {Array.isArray(item?.extracted_comments) &&
                          item?.extracted_comments?.length > 0 ? (
                            <Tooltip
                              title={
                                item?.extracted_comments?.length +
                                (item?.extracted_comments?.length > 1 ? ' Comments' : ' Comment')
                              }
                              placement="top"
                              arrow
                            >
                              <div
                                onClick={() => toggleComments(item)}
                                className="mt-2"
                              >
                                <Badge
                                  badgeContent={item?.extracted_comments?.length}
                                  classes={classes.root}
                                  color={'secondary'}
                                >
                                  <FaComment style={{ fontSize: 15, color: '#627daf' }} />
                                </Badge>
                              </div>
                            </Tooltip>
                          ) : (
                            <FaComment style={{ fontSize: 15, color: '#aeaeae' }} />
                          )}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {/* {item?.created_by_details?.id === parsedUser?.id && ( */}
                        <Tooltip title="Archive this document">
                          <div onClick={() => toggleDialog(item)}>
                            <img
                              src={ArchiveIcon}
                              onMouseOver={(e) => (e.currentTarget.src = ArchiveDanger)}
                              onMouseOut={(e) => (e.currentTarget.src = ArchiveIcon)}
                              style={{ width: 20, height: 20 }}
                            />
                          </div>
                        </Tooltip>
                        {/* )} */}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function TableComponent({ table_data, board }) {
  const classes = useStyles();
  const activeDocs =
    table_data.length > 0
      ? table_data?.filter((item) => item.archived === false && item.grouping_id !== null)
      : [];
  const { accessToken: api_token } = useUserContext();
  const groupedDocs = useMemo(() => groupBy(activeDocs, 'grouping_id'), [activeDocs]);
  let arr = Object.keys(groupedDocs).map((item) => groupedDocs[item]);
  let originalDocs = [];
  let finalArr = [];
  arr.forEach((element) => {
    originalDocs.push(element.reduce((acc, shot) => (acc = acc > shot ? acc : shot), 0));
    finalArr.push(element);
  });
  finalArr.forEach((element, index) => {
    element.original_doc = originalDocs[index];
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [tabVal, setTabVal] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const toggleDialog = useCallback(
    (e) => {
      setData(e);
      setOpenDialog(!openDialog);
    },
    [openDialog, data],
  );

  const toggleComments = (e) => {
    setTabVal(1);
    setData(e);
    dispatch(fetchData(e));
    setShowDetails(true);
  };

  const handleShowTrackings = (e) => {
    dispatch(setMessage('Loading...'));
    setTabVal(0);
    setData(e);
    dispatch(fetchData(e));
    dispatch(requestClauseList({ doc_id: e.id, hidden: false }));
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setTabVal(0);
    setShowDetails(false);
  };

  const handleShowClauses = (e) => {
    setTabVal(2);
    dispatch(fetchData(e));
    dispatch(setMessage('Loading...'));
    setData(e);
    dispatch(requestClauseList({ doc_id: e.id, hidden: false }));
    setShowDetails(true);
  };

  const handleClose = (e) => {
    if (e.close) {
      handleArchiveDocument();
    }
    setOpenDialog(!openDialog);
  };

  const handleArchiveDocument = () => {
    const formData = new FormData();
    formData.append('name', data?.name);
    formData.append('archived', data?.archived ? 'False' : 'True');
    dispatch(show(true));
    dispatch(
      updateDocument({
        id: data?.id,
        card_id: data?.card,
        board_id: null,
        data: formData,
        refresh: true,
      }),
    );
  };

  return (
    <>
      {activeDocs.length > 0 ? (
        <TableContainer
          className={board ? classes.forDashboard : classes.container}
          style={{
            border: 1,
            borderColor: '#999',
            borderStyle: 'solid',
            borderRadius: 6,
          }}
        >
          <Table
            className={classes.table}
            aria-label="customized table"
          >
            <TableBody>
              {finalArr?.map((i) => (
                // TODO FIXME
                // eslint-disable-next-line react/jsx-key
                <Row
                  row={i}
                  api_token={api_token}
                  toggleComments={toggleComments}
                  toggleDialog={toggleDialog}
                  toggleTrackings={handleShowTrackings}
                  toggleClauses={handleShowClauses}
                  forBoard={board}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="text-centre">
          <strong>No attached documents.</strong>
        </div>
      )}
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          handleClose={handleClose}
          dialogTitle={'Archive this document!'}
          dialogContent={'Are you sure to archive this document?'}
        />
      )}
      <DocumentDetails
        open={showDetails}
        handleClose={handleCloseDetails}
        tab={tabVal}
      />
    </>
  );
}

export default React.memo(TableComponent);
