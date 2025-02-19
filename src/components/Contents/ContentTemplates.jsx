import {
  Button,
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
import PropTypes from 'prop-types';
import {
  AddCircleOutlineOutlined,
  CodeOutlined,
  DescriptionOutlined,
  ImageAspectRatioOutlined,
  Link,
  WebAssetOutlined,
} from '@mui/icons-material';
import { VimeoLogo, YouTubeLogo } from '../SvgIcons';
import { FaFileAlt, FaFilePdf, FaImage } from 'react-icons/fa';
import ArchiveIcon from '../../assets/icons/archive.png';
import ArchiveDanger from '../../assets/icons/archive_danger.png';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContentForm from './ContentForm';
import { requestContentsList, updateContent } from '../../Redux/Actions/dashboard-data';
import { stableSort, getComparator } from '../../component-lib/JFTable/JFTable';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#eef2f6',
    color: theme.palette.common.black,
    fontWeight: '700',
    width: '20%',
    height: 'auto',
    border: 'none',
  },
  body: {
    height: 40,
    padding: 8,
    fontSize: 16,
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

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
  draggingListItem: {
    background: 'rgb(235,235,235)',
  },
  container: {
    maxHeight: `calc(100vh - 278px)`,
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
});

const headCells = [
  { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
  { id: 'tab_name', numeric: true, disablePadding: false, label: 'Tab' },
  { id: '', numeric: true, disablePadding: false, label: '' },
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
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
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

function ContentTemplates({ clone, close }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const allContents = useSelector((state) => state.allContentsData);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('title');
  const [selected, setSelected] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [forAdd, setforAdd] = React.useState(false);
  const handleOpenForm = (id) => {
    setOpen(true);
    if (id == null) {
      setforAdd(true);
    } else {
      setforAdd(false);
      dispatch(requestContentsList({ id: id, fetchContent: true }));
    }
  };
  const handleClose = () => {
    setOpen(false);
    if (clone) close();
  };
  const handleActions = (content) => {
    const reqBody = {
      archived: content.archived ? false : true,
    };
    dispatch(
      updateContent({
        data: reqBody,
        id: content.id,
        board: null,
      }),
    );
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleClick = (data) => {
    let newSelected = selected;
    if (data.title !== selected) {
      newSelected = data.title;
      setSelectedId(data.id);
    }
    setSelected(newSelected);
  };

  return (
    <TableContainer className={classes.container}>
      <div className="d-flex justify-space-between">
        <div></div>
        {!clone && (
          <Tooltip title="Add new content">
            <button
              className="m-4"
              onClick={() => handleOpenForm(null)}
            >
              <AddCircleOutlineOutlined className="app-color h-8 w-8" />
            </button>
          </Tooltip>
        )}
      </div>
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
          {stableSort(allContents?.data?.cblocks, getComparator(order, orderBy)).map((row) => {
            return (
              <StyledTableRow
                onClick={() => {
                  clone && handleClick(row);
                }}
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
                    onClick={() => {
                      handleOpenForm(row?.id);
                    }}
                    className="ml-2 cursor-pointer"
                  >
                    {row?.title}
                  </p>
                </StyledTableCell>
                <StyledTableCell align="right">{row?.tab_name}</StyledTableCell>
                {clone ? (
                  <StyledTableCell padding={'checkbox'}>
                    <Button
                      variant="outlined"
                      style={{
                        border: `1px solid #6385b7`,
                        color: '#6385b7',
                        height: 25,
                        fontSize: 16,
                      }}
                      onClick={() => handleOpenForm(row.id)}
                      className="app-color"
                    >
                      Import
                    </Button>
                  </StyledTableCell>
                ) : (
                  <StyledTableCell align="left">
                    <div className="d-flex">
                      <div className="width-33" />
                      <button onClick={() => handleActions(row)}>
                        <img
                          src={ArchiveIcon}
                          onMouseOver={(e) => (e.currentTarget.src = ArchiveDanger)}
                          onMouseOut={(e) => (e.currentTarget.src = ArchiveIcon)}
                          style={{ width: 18, height: 18 }}
                        />
                      </button>
                    </div>
                  </StyledTableCell>
                )}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
      <ContentForm
        open={open}
        handleClose={handleClose}
        isAdd={forAdd}
        id={clone ? '' : null}
        isImport={clone}
        selected_id={selectedId}
      />
    </TableContainer>
  );
}

export default React.memo(ContentTemplates);
