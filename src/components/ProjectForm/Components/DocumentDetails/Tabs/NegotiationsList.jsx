import { Divider, List, ListItem, ListItemText, IconButton, Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';
import {
  EditOutlined,
  HistoryOutlined,
  ImportContactsOutlined,
  LibraryBooksOutlined,
  Star,
  StarBorderOutlined,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditClauses from '../../EditClauses';
import {
  requestClauseLibrary,
  requestSingleClause,
  updateClause,
} from '../../../../../Redux/Actions/document-upload';
import { setMessage } from '../../../../../Redux/Actions/loader';
import LibraryList from './LibraryList';

const StyledListItem = withStyles({
  root: {
    padding: 0,
    '&$selected': {
      backgroundColor: '#f5f5f5',
      color: '#000000',
      '& .MuiListItemIcon-root': {
        color: '#000000',
      },
    },
    '&$selected:hover': {
      backgroundColor: '#f5f5f5',
      color: '#000000',
      '& .MuiListItemIcon-root': {
        color: '#000000',
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

function NegotiationsList({ list, docData, filters }) {
  const libraries = useSelector((state) => state.clauseLibraryData);
  const libraryData = libraries?.data?.length > 0 ? libraries?.data : [];
  const noDataMessage = useSelector((state) => state.messageData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [edit, setEdit] = useState(false);
  const [label, setLabel] = useState('');
  const [libraryList, setLibraryList] = useState([]);
  const dispatch = useDispatch();

  const handleEditClause = (id) => {
    dispatch(requestSingleClause({ clause_id: id }));
    setEdit(true);
  };

  const handleCloseEdit = () => {
    setEdit(false);
  };

  const handleStareClause = (e) => {
    const reqBody = {
      stare_clause: e?.stare_clause,
    };
    dispatch(
      updateClause({
        hidden: filters === 3,
        modified: filters === 1,
        stareClauses: filters === 2,
        clause_id: e?.id,
        data: reqBody,
        doc_id: docData?.id,
      }),
    );
  };

  useEffect(() => {
    if (selectedItem !== null) {
      setLibraryList(libraryData);
    } else {
      setLibraryList([]);
    }
  }, [selectedItem, libraries]);

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
          file_uuid: docData.grouping_id,
          fetchHistory: true,
        }),
      );
    }
  };

  return (
    <>
      <div className="d-flex">
        <div className={selectedItem !== null ? 'flex-7 dialog-height' : 'flex-10 dialog-height'}>
          {(list || [])?.map((clause, index) => (
            <List
              key={clause.id}
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
                              <strong>{clause?.clause_index + ' ' + clause?.clause_name}</strong>
                            </div>
                            <div className="d-flex flex-1">
                              <Tooltip
                                title="Edit"
                                placement="top"
                              >
                                <IconButton
                                  style={{ padding: 5 }}
                                  onClick={() => handleEditClause(clause.id)}
                                >
                                  <EditOutlined className="MuiListItemIcon-root" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title="Open Library"
                                placement="top"
                              >
                                <IconButton
                                  style={{ padding: 5 }}
                                  onClick={() =>
                                    handleClauseLibrary(true, clause.word_paraid, index, false)
                                  }
                                >
                                  <LibraryBooksOutlined className="MuiListItemIcon-root" />
                                </IconButton>
                              </Tooltip>
                              {docData?.version > 1 ? (
                                <Tooltip
                                  title="Open History"
                                  placement="top"
                                >
                                  <IconButton
                                    style={{ padding: 5 }}
                                    onClick={() =>
                                      handleClauseLibrary(false, clause.word_paraid, index, true)
                                    }
                                  >
                                    <HistoryOutlined className="MuiListItemIcon-root" />
                                  </IconButton>
                                </Tooltip>
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
                    component={'li'}
                  />
                ) : (
                  ''
                )}
              </>
            </List>
          ))}
        </div>
        {selectedItem !== null &&
          (libraryList?.length > 0 ? (
            <LibraryList
              libraryList={libraryList}
              label={label}
            />
          ) : (
            <div
              className="flex-3 dialog-height div-center"
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '1rem',
              }}
            >
              <ImportContactsOutlined style={{ height: 40, width: 40, color: '#627daf' }} />
              <strong>{noDataMessage.message}</strong>
            </div>
          ))}
      </div>
      <EditClauses
        open={edit}
        document_id={docData?.id}
        handleClose={handleCloseEdit}
        filters={filters}
      />
    </>
  );
}

export default React.memo(NegotiationsList);
