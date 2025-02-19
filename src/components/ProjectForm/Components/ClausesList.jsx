import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Slide,
  Tooltip,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import {
  ArrowBackIos,
  ArrowForwardIos,
  BallotOutlined,
  Close,
  EditOutlined,
  HistoryOutlined,
  ImportContactsOutlined,
  LabelImportantOutlined,
  LibraryBooksOutlined,
  Star,
  StarBorderOutlined,
  StarOutlineOutlined,
  VisibilityOffOutlined,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/Loader';
import {
  requestSingleClause,
  requestClauseLibrary,
  updateClause,
  requestClauseList,
} from '../../../Redux/Actions/document-upload';
import { setMessage, show } from '../../../Redux/Actions/loader';
import ClauseLibrary from './ClauseLibrary';
import EditClauses from './EditClauses';

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

const StyledListItem = withStyles({
  root: {
    '&$selected': {
      backgroundColor: '#627daf',
      borderTopLeftRadius: '1rem',
      borderBottomLeftRadius: '1rem',
      color: '#ffffff',
      '& .MuiListItemIcon-root': {
        color: '#ffffff',
      },
    },
    '&$selected:hover': {
      backgroundColor: '#627daf',
      color: '#ffffff',
      '& .MuiListItemIcon-root': {
        color: '#ffffff',
      },
    },
    '&:hover': {
      backgroundColor: '#F1F1F1',
      color: '#000000',
      '& .MuiListItemIcon-root': {
        color: '#000000',
      },
    },
  },
  selected: {},
})(ListItem);

const StyledFormControlLabel = withStyles({
  root: {
    marginLeft: 0,
    border: `1px solid #627daf`,
    borderRadius: `2.5rem`,
    '&$selected': {
      backgroundColor: '#627daf',
      color: '#ffffff',
    },
  },
  selected: {
    backgroundColor: '#627daf',
    color: '#ffffff',
  },
})(FormControlLabel);

function ClausesList({ open, handleClose, doc_id }) {
  const dispatch = useDispatch();
  const clauses = useSelector((state) => state.clausesData);
  const clauseData = clauses?.data?.length > 0 ? clauses?.data : [];
  const libraries = useSelector((state) => state.clauseLibraryData);
  const libraryData = libraries?.data?.length > 0 ? libraries?.data : [];
  const loader = useSelector((state) => state.showLoader);
  const noDataMessage = useSelector((state) => state.messageData);
  const [edit, setEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [listData, setListData] = useState([]);
  const [label, setLabel] = useState('');
  const [filter, setFilter] = React.useState('default');
  const [libraryList, setLibraryList] = useState([]);
  const [showLib, setShowLib] = useState(true);

  const handleShowLib = () => {
    setShowLib(!showLib);
  };

  const handleFilters = (event) => {
    dispatch(setMessage('Loading...'));
    setFilter(event.target.value);
    setListData(null);
    setSelectedItem(null);
    setLibraryList(null);
    if (event.target.value === 'default') {
      dispatch(requestClauseList({ doc_id: doc_id?.id, hidden: false }));
    }
    if (event.target.value === 'focused') {
      dispatch(requestClauseList({ doc_id: doc_id?.id, modified: true }));
    }
    if (event.target.value === 'stare') {
      dispatch(requestClauseList({ doc_id: doc_id?.id, stareClauses: true }));
    }
    if (event.target.value === 'hidden') {
      dispatch(requestClauseList({ doc_id: doc_id?.id, hidden: true }));
    }
  };
  const handleEditClause = (id) => {
    dispatch(show(true));
    dispatch(requestSingleClause({ clause_id: id }));
    setEdit(true);
  };
  const handleClear = () => {
    setListData(null);
    setLibraryList(null);
    setSelectedItem(null);
    setShowLib(true);
    setFilter('default');
    handleClose();
  };
  const handleStareClause = (e) => {
    const reqBody = {
      stare_clause: e?.stare_clause,
    };
    dispatch(
      updateClause({
        hidden: filter === 'default' || filter === 'hidden',
        modified: filter === 'focused',
        stareClause: filter === 'stare',
        clause_id: e?.id,
        data: reqBody,
        doc_id: doc_id?.id,
      }),
    );
  };
  const handleCloseEdit = () => {
    setEdit(false);
  };
  useEffect(() => {
    if (selectedItem !== null) {
      setLibraryList(libraryData);
    } else {
      setLibraryList([]);
    }
  }, [libraries]);
  useEffect(() => {
    setListData(clauseData);
  }, [clauses]);
  const handleClauseLibrary = (library, para_id, index, history) => {
    dispatch(setMessage('Loading...'));
    setLibraryList([]);
    setSelectedItem(index);
    if (library) {
      setLabel('Library');
      dispatch(requestClauseLibrary({ para_id: para_id, fetchLibrary: true }));
    }
    if (history) {
      setLabel('History');
      dispatch(
        requestClauseLibrary({
          para_id: para_id,
          file_uuid: doc_id.grouping_id,
          fetchHistory: true,
        }),
      );
    }
  };
  return (
    <>
      <Dialog
        fullWidth
        maxWidth={selectedItem !== null ? 'lg' : 'md'}
        open={open}
        onClose={handleClear}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{
            padding: `3px 5px`,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={filter}
            onChange={handleFilters}
            row
          >
            <StyledFormControlLabel
              style={{
                backgroundColor: filter === 'default' ? '#627daf' : '#ffffff',
              }}
              value="default"
              control={
                <Radio
                  style={{
                    padding: 5,
                    color: filter === 'default' ? '#ffffff' : '#627daf',
                  }}
                />
              }
              label={
                <div className="d-flex">
                  <Tooltip title="Display All Except Hidden">
                    <BallotOutlined
                      style={{
                        color: filter === 'default' ? '#ffffff' : '#627daf',
                      }}
                    />
                  </Tooltip>
                  <strong
                    style={{
                      color: filter === 'default' ? '#ffffff' : '#627daf',
                      marginRight: 5,
                    }}
                  >
                    Default
                  </strong>
                </div>
              }
            />
            <StyledFormControlLabel
              style={{
                backgroundColor: filter === 'focused' ? '#627daf' : '#ffffff',
              }}
              value="focused"
              control={
                <Radio
                  style={{
                    padding: 5,
                    color: filter === 'focused' ? '#ffffff' : '#627daf',
                  }}
                />
              }
              label={
                <div className="d-flex">
                  <Tooltip title="Clauses with changes or marked as stare">
                    <LabelImportantOutlined
                      style={{
                        color: filter === 'focused' ? '#ffffff' : '#627daf',
                      }}
                    />
                  </Tooltip>
                  <strong
                    style={{
                      color: filter === 'focused' ? '#ffffff' : '#627daf',
                      marginRight: 5,
                    }}
                  >
                    Focused
                  </strong>
                </div>
              }
            />
            <StyledFormControlLabel
              style={{
                backgroundColor: filter === 'stare' ? '#627daf' : '#ffffff',
              }}
              value="stare"
              control={
                <Radio
                  style={{
                    padding: 5,
                    color: filter === 'stare' ? '#ffffff' : '#627daf',
                  }}
                />
              }
              label={
                <div className="d-flex">
                  <Tooltip title="Clauses marked as stare">
                    <StarOutlineOutlined
                      style={{
                        color: filter === 'stare' ? '#ffffff' : '#627daf',
                      }}
                    />
                  </Tooltip>
                  <strong
                    style={{
                      color: filter === 'stare' ? '#ffffff' : '#627daf',
                      marginRight: 5,
                    }}
                  >
                    Stare
                  </strong>
                </div>
              }
            />
            <StyledFormControlLabel
              style={{
                backgroundColor: filter === 'hidden' ? '#627daf' : '#ffffff',
              }}
              value="hidden"
              control={
                <Radio
                  style={{
                    padding: 5,
                    color: filter === 'hidden' ? '#ffffff' : '#627daf',
                  }}
                />
              }
              label={
                <div className="d-flex">
                  <Tooltip title="Clauses marked as hidden">
                    <VisibilityOffOutlined
                      style={{
                        color: filter === 'hidden' ? '#ffffff' : '#627daf',
                      }}
                    />
                  </Tooltip>
                  <strong
                    style={{
                      color: filter === 'hidden' ? '#ffffff' : '#627daf',
                      marginRight: 5,
                    }}
                  >
                    Hidden
                  </strong>
                </div>
              }
            />
          </RadioGroup>
          <div style={{ position: 'absolute', right: 0, top: -8 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClear}
              aria-label="close"
            >
              <Close style={{ height: 30, width: 30, color: '#627daf' }} />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={{ padding: `5px 10px` }}>
          {!listData?.length ? (
            loader.show ? (
              <Loader />
            ) : (
              <div className="flex-5 dialog-height div-center">
                <strong>{noDataMessage?.message}</strong>
              </div>
            )
          ) : (
            <div style={{ display: 'flex' }}>
              <div
                className={selectedItem !== null ? 'flex-5 dialog-height' : 'flex-10 dialog-height'}
              >
                {(listData || [])?.map((clause, index) => (
                  // TODO FIXME
                  // eslint-disable-next-line react/jsx-key
                  <List
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      bgcolor: 'background.paper',
                    }}
                    disablePadding
                  >
                    <>
                      <StyledListItem selected={selectedItem === index}>
                        <ListItemText
                          style={{ cursor: 'pointer' }}
                          primary={
                            !clause?.roll_up ? (
                              <div className="d-flex-column">
                                <div className="d-flex">
                                  <div className="flex-9">
                                    <strong>
                                      {clause?.clause_index + ' ' + clause?.clause_name}
                                    </strong>
                                  </div>
                                  <div className="d-flex flex-1">
                                    <IconButton
                                      style={{ padding: 5 }}
                                      onClick={() => handleEditClause(clause.id)}
                                    >
                                      <EditOutlined className="MuiListItemIcon-root" />
                                    </IconButton>
                                    <IconButton
                                      style={{ padding: 5 }}
                                      onClick={() =>
                                        handleClauseLibrary(true, clause.word_paraid, index, false)
                                      }
                                    >
                                      <LibraryBooksOutlined className="MuiListItemIcon-root" />
                                    </IconButton>
                                    {doc_id?.version > 1 ? (
                                      <IconButton
                                        style={{ padding: 5 }}
                                        onClick={() =>
                                          handleClauseLibrary(
                                            false,
                                            clause.word_paraid,
                                            index,
                                            true,
                                          )
                                        }
                                      >
                                        <HistoryOutlined className="MuiListItemIcon-root" />
                                      </IconButton>
                                    ) : (
                                      ''
                                    )}
                                    <IconButton
                                      style={{ padding: 5 }}
                                      onClick={() =>
                                        handleStareClause({
                                          id: clause.id,
                                          stare_clause: clause?.stare_clause ? false : true,
                                        })
                                      }
                                    >
                                      {clause?.stare_clause ? (
                                        <Star
                                          style={{
                                            color: '#FFC300',
                                            width: 25,
                                            height: 25,
                                          }}
                                        />
                                      ) : (
                                        <StarBorderOutlined
                                          className="MuiListItemIcon-root"
                                          style={{ width: 25, height: 25 }}
                                        />
                                      )}
                                    </IconButton>
                                  </div>
                                </div>
                                <div>
                                  <p
                                    className="inner-html"
                                    dangerouslySetInnerHTML={{
                                      __html: clause?.clause_text,
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div onDoubleClick={() => handleEditClause(clause.id)}>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: clause?.clause_text,
                                  }}
                                />
                              </div>
                            )
                          }
                        />
                      </StyledListItem>
                      {!clause?.roll_up ? (
                        <Divider
                          variant="fullWidth"
                          style={{ marginLeft: 15 }}
                          component={'li'}
                        />
                      ) : (
                        ''
                      )}
                    </>
                  </List>
                ))}
                {!showLib && (
                  <div style={{ position: 'absolute', right: 10, top: 65 }}>
                    <IconButton
                      onClick={handleShowLib}
                      style={{
                        backgroundColor: '#627daf',
                        height: 30,
                        width: 30,
                        borderRadius: '8%',
                      }}
                    >
                      <ArrowForwardIos style={{ color: '#ffffff' }} />
                    </IconButton>
                  </div>
                )}
              </div>
              {selectedItem !== null &&
                showLib &&
                (libraryList?.length > 0 ? (
                  <div
                    className="flex-5 dialog-height"
                    style={{
                      border: '2px solid #627daf',
                      borderEndEndRadius: '1rem',
                      borderStartEndRadius: '1rem',
                    }}
                  >
                    {libraryList?.map((library) => (
                      // TODO FIXME
                      // eslint-disable-next-line react/jsx-key
                      <ClauseLibrary data={library} />
                    ))}
                    <div style={{ position: 'absolute', left: '50%', top: 65 }}>
                      <div
                        style={{
                          backgroundColor: '#627daf',
                          height: 23,
                          width: 'auto',
                          borderEndEndRadius: '0.75rem',
                        }}
                      >
                        <strong style={{ color: '#ffffff', margin: 8 }}>{label}</strong>
                      </div>
                    </div>
                    <div style={{ position: 'absolute', right: 10, top: 65 }}>
                      <IconButton
                        onClick={handleShowLib}
                        style={{
                          backgroundColor: '#627daf',
                          height: 30,
                          width: 30,
                          borderStartStartRadius: '8%',
                          borderEndEndRadius: '8%',
                        }}
                      >
                        <ArrowBackIos style={{ color: '#ffffff', marginLeft: 10 }} />
                      </IconButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex-5 dialog-height div-center">
                    <ImportContactsOutlined style={{ height: 40, width: 40, color: '#627daf' }} />
                    <strong>{noDataMessage.message}</strong>
                    <div style={{ position: 'absolute', right: 10, top: 65 }}>
                      <IconButton
                        onClick={handleShowLib}
                        style={{
                          backgroundColor: '#627daf',
                          height: 30,
                          width: 30,
                          borderRadius: '8%',
                        }}
                      >
                        <ArrowBackIos style={{ color: '#ffffff', marginLeft: 10 }} />
                      </IconButton>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <EditClauses
        open={edit}
        document_id={doc_id?.id}
        handleClose={handleCloseEdit}
        filters={filter}
      />
    </>
  );
}

export default React.memo(ClausesList);
