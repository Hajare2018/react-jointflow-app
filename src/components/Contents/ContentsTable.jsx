import { Table, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import {
  AddCircleOutlineOutlined,
  CodeOutlined,
  DescriptionOutlined,
  FileCopyOutlined,
  ImageAspectRatioOutlined,
  Link,
  ReorderOutlined,
  VisibilityOffSharp,
  VisibilitySharp,
  WebAssetOutlined,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import ArchiveIcon from '../../assets/icons/archive.png';
import ArchiveDanger from '../../assets/icons/archive_danger.png';
import { reorder } from '../Workload/helper';
import { useDispatch, useSelector } from 'react-redux';
import ContentForm from './ContentForm';
import {
  requestContentsList,
  saveContent,
  updateContent,
} from '../../Redux/Actions/dashboard-data';
import { VimeoLogo, YouTubeLogo } from '../SvgIcons';
import { FaFileAlt, FaFilePdf, FaImage } from 'react-icons/fa';
import { completed } from '../../Redux/Actions/completed-value';
import ContentsPreview from './ContentsPreview';
import ContentsList from './ContentsList';
import PandadocDialog from './PandadocDialog';
import { useTenantContext } from '../../context/TenantContext';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#eef2f6',
    color: theme.palette.common.black,
    fontWeight: '700',
    width: 'auto',
    height: 'auto',
    border: 'none',
  },
  body: {
    fontSize: 12,
    height: 40,
    padding: 8,
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
  },
  draggingListItem: {
    background: 'rgb(235,235,235)',
  },
  container: {
    maxHeight: `65vh`,
    '@media(max-height: 1080px)': {
      maxHeight: `99vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `95vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `95vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `87vh`,
    },
  },
});

function DraggableRow({ row, index, count }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleOpenForm = (id) => {
    dispatch(requestContentsList({ id: id, fetchContent: true }));
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleActions = (content, action) => {
    if (action === 'visible') {
      const reqBody = {
        client_visible: content.client_visible ? false : true,
      };
      dispatch(
        updateContent({
          data: reqBody,
          id: content?.id,
          board: content?.board,
        }),
      );
    } else if (action === 'archive') {
      const reqBody = {
        archived: content.archived ? false : true,
      };
      dispatch(
        updateContent({
          data: reqBody,
          id: content?.id,
          board: content?.board,
        }),
      );
    }
  };
  return (
    <>
      <Draggable
        draggableId={row?.id?.toString()}
        index={index}
        key={row?.id}
      >
        {(provided, snapshot) => (
          <StyledTableRow
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={snapshot.isDragging ? classes.draggingListItem : ''}
            key={row?.id}
          >
            <StyledTableCell
              style={{
                color: '#627daf',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
              }}
              scope="row"
              align="left"
            >
              {row?.type == 'YOUTUBE' ? (
                <YouTubeLogo />
              ) : row?.type == 'VIMEO' ? (
                <VimeoLogo />
              ) : row?.type == 'EMBED' ? (
                <CodeOutlined />
              ) : row?.type == 'EMBED_LINK' ? (
                <WebAssetOutlined />
              ) : row?.type == 'LINK' ? (
                <Link />
              ) : row?.type == 'TEXT' ? (
                <DescriptionOutlined />
              ) : row?.type == 'IMAGE' ? (
                <FaImage />
              ) : row?.type == 'CANVAS' ? (
                <ImageAspectRatioOutlined />
              ) : row?.type == 'PDF' ? (
                <FaFilePdf />
              ) : row?.type == 'FILE' ? (
                <FaFileAlt />
              ) : (
                ''
              )}
              <p
                onClick={() => handleOpenForm(row?.id)}
                className="ml-2"
              >
                {row?.title}
              </p>
            </StyledTableCell>
            <StyledTableCell align="left">{row?.tab_name}</StyledTableCell>
            <StyledTableCell align="left">
              <div className="d-flex justify-space-between">
                <div className="width-33" />
                <button onClick={() => handleActions(row, 'visible')}>
                  {row?.client_visible ? (
                    <VisibilitySharp style={{ color: 'green' }} />
                  ) : (
                    <VisibilityOffSharp style={{ color: 'red' }} />
                  )}
                </button>
                <button onClick={() => handleActions(row, 'archive')}>
                  <img
                    src={ArchiveIcon}
                    onMouseOver={(e) => (e.currentTarget.src = ArchiveDanger)}
                    onMouseOut={(e) => (e.currentTarget.src = ArchiveIcon)}
                    style={{ width: 18, height: 18 }}
                  />
                </button>
                <ReorderOutlined />
              </div>
            </StyledTableCell>
          </StyledTableRow>
        )}
      </Draggable>
      <ContentForm
        open={open}
        handleClose={handleClose}
        isAdd={false}
        contentCount={count}
      />
    </>
  );
}

function ContentsTable({ isPreview, withLibraryButton }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [items, setItems] = useState();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [showList, setShowList] = useState(false);
  const board = useSelector((state) => state.singleProjectData);
  const boardData = board?.data?.length > 0 ? board?.data?.[0] : [];
  const contentsData = useSelector((state) => state.contentsData);
  const allContents = contentsData?.data?.cblocks;
  const { pandadoc_api_key } = useTenantContext();

  const [isPandadocActive, setIsPandadocActive] = useState(false);

  useEffect(() => {
    setItems(allContents);
  }, [contentsData]);
  const onDragEnd = ({ destination, source }) => {
    if (!destination) return;
    const newItems = reorder(items, source.index, destination.index);
    setItems(newItems.result);
    let order = [];
    let final = Object.keys(allContents)
      .filter((index) => allContents[index] !== newItems.result[index])
      .map((index) => newItems.result[index]);
    final?.forEach((element) => {
      let finalIndices = newItems.result.map((x) => x.id).indexOf(element.id);
      order.push({
        cblock_id: element.id,
        order_number: finalIndices + 1,
      });
    });
    dispatch(
      completed({
        data: { cblocks: order },
        board: allContents?.[0]?.board,
        updateOrder: true,
      }),
    );
  };
  const handleOpenForm = () => {
    setOpen(!open);
  };
  const handlePreview = () => {
    setPreview(!preview);
  };

  const handleImport = () => {
    setShowList(true);
    dispatch(requestContentsList({ id: null, fetchContent: false }));
  };

  const handleCloseImport = () => {
    setShowList(false);
  };
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-table">
          {(provided) => (
            <TableContainer
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classes.container}
            >
              <Table
                className={classes.table}
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Tab</StyledTableCell>
                    <StyledTableCell align="right">
                      <div className="flex flex-row gap-x-2 justify-end items-center">
                        {pandadoc_api_key && (
                          <button onClick={() => setIsPandadocActive(true)}>
                            <img
                              src="https://d3m3a7p0ze7hmq.cloudfront.net/favicon.ico"
                              className="w-6 h-6 min-w-6 min-h-6"
                            />
                          </button>
                        )}
                        <button onClick={handleOpenForm}>
                          <AddCircleOutlineOutlined className="app-color h-6 w-6" />
                        </button>
                        {withLibraryButton && (
                          <Tooltip title="Import from Library">
                            <button onClick={handleImport}>
                              <FileCopyOutlined className="app-color h-6 w-6" />
                            </button>
                          </Tooltip>
                        )}
                        {isPreview && (
                          <button
                            onClick={handlePreview}
                            className="btn-comment"
                          >
                            Preview
                          </button>
                        )}
                      </div>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                {(items || []).map((row, index) => (
                  // TODO FIXME not sure what can be used as a key, maybe row.id?
                  // eslint-disable-next-line react/jsx-key
                  <DraggableRow
                    row={row}
                    index={index}
                    count={items?.length}
                  />
                ))}
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>
      <ContentForm
        open={open}
        handleClose={handleOpenForm}
        isAdd={true}
        id={boardData?.id}
      />
      <ContentsList
        open={showList}
        handleClose={handleCloseImport}
        board={boardData?.id}
      />
      <ContentsPreview
        open={preview}
        handleClose={handlePreview}
      />
      {pandadoc_api_key && (
        <PandadocDialog
          pandadocApiKey={pandadoc_api_key}
          open={isPandadocActive}
          onClose={() => setIsPandadocActive(false)}
          onDocumentSent={(d) => {
            const formData = new FormData();
            formData.append('title', 'External signature');
            formData.append('type', 'EMBED_LINK');
            formData.append('url', `https://app.pandadoc.com/s/${d.clientSessionId}/`);
            formData.append('caption', '');
            formData.append('client_visible', true);
            formData.append('hide_title', true);
            formData.append('hide_header', true);
            formData.append('tab_name', 'External signature');
            formData.append('board', boardData?.id);

            const formData2 = new FormData();
            formData2.append('title', 'Internal signature');
            formData2.append('type', 'EMBED_LINK');
            formData2.append('url', `https://app.pandadoc.com/s/${d.senderSessionId}/`);
            formData2.append('caption', '');
            formData2.append('client_visible', true);
            formData2.append('hide_title', true);
            formData2.append('hide_header', true);
            formData2.append('tab_name', 'Internal signature');
            formData2.append('board', boardData?.id);

            dispatch(
              saveContent({
                data: formData,
                board: boardData?.id,
              }),
            );

            dispatch(
              saveContent({
                data: formData2,
                board: boardData?.id,
              }),
            );
          }}
        />
      )}
    </div>
  );
}

export default React.memo(ContentsTable);
