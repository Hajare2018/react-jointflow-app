import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { Close, Check } from '@mui/icons-material';
import clsx from 'clsx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savePlaybookStatus, updateProject } from '../../../../Redux/Actions/create-project';

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

const EnhancedTableToolbar = ({ numSelected, board, selected_id, close, isPlaybook }) => {
  const classes = useToolbarStyles();
  const dispatch = useDispatch();

  const onNextClick = () => {
    const reqBody = {
      board: board,
      status: selected_id,
    };
    const boardReqBody = {
      pb_status: selected_id,
    };
    if (isPlaybook) {
      dispatch(savePlaybookStatus({ data: reqBody }));
      close();
    } else {
      dispatch(
        updateProject({
          id: board,
          data: boardReqBody,
          closedBoards: false,
          is_crm: false,
        }),
      );
      close();
      // if (isArchived) {
      //   setOpen(true);
      // } else {
      //   dispatch(
      //     updateProject({
      //       id: board,
      //       data: boardReqBody,
      //       closedBoards: false,
      //       is_crm: false,
      //     })
      //   );
      //   close();
      // }
    }
  };

  // const handleArchive = (e) => {
  //   const boardReqBody = {
  //     pb_status: selected_id,
  //   };
  //   if (e.close) {
  //     dispatch(
  //       updateProject({
  //         id: board,
  //         data: boardReqBody,
  //         closedBoards: false,
  //         is_crm: false,
  //       })
  //     );
  //     setOpen(!open);
  //   } else {
  //     setOpen(!open);
  //   }
  //   close();
  // };
  return (
    <>
      <Toolbar
        style={{ display: 'flex' }}
        className={clsx(classes.root, {
          [classes.highlight]: numSelected,
        })}
      >
        {numSelected ? (
          <div style={{ width: '100%', padding: 10 }}>
            <Typography
              style={{ float: 'left' }}
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
            <Button
              variant="contained"
              onClick={onNextClick}
              className="next-btn"
              //   disabled={loader.show}
            >
              NEXT
              {/* {loader.show && (
                <CircularProgress className="ml-2 h-5 w-5 white-color" />
              )} */}
            </Button>
          </div>
        ) : (
          ''
        )}
      </Toolbar>
      {/* <ConfirmDialog
        open={open}
        dialogTitle={"Archive"}
        onlyAdd={false}
        addAndReplace={false}
        dialogContent={
          <div className="text-centre">
            <WarningRounded
              style={{
                color: "lightcoral",
                height: "4rem",
                width: "4rem",
              }}
            />
            <p>Warning, are you sure you want to archive this project?</p>
            <p>Archived projects cannot be re-opened!</p>
          </div>
        }
        handleClose={handleArchive}
      /> */}
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

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
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: 'rgba(183, 244, 216, 0.7)',
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: '100%',
    height: 40,
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#ffffff',
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
  root: {
    width: '100%',
    '& .MuiTablePagination-root p': {
      fontSize: '0.7rem !important',
    },
  },
  container: {
    maxHeight: `65vh`,
    '@media(max-height: 1080px)': {
      maxHeight: `85vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `80vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `67vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `54vh`,
    },
  },
}));

function StatusTableModal({ open, handleClose, board, forPlaybook }) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(0);
  const [isArchived, setIsArchived] = React.useState(false);
  const statusData = useSelector((state) => state.anotherStatusesData);
  const status = statusData?.data?.length > 0 ? statusData?.data : [];

  const status_for_board = useSelector((state) => state.statusesData);
  const status_list = status_for_board?.data?.length > 0 ? status_for_board?.data : [];

  const handleClick = (data) => {
    let newSelected = selected;
    if (data.custom_label !== selected) {
      newSelected = data.custom_label;
      setSelectedId(data.id);
      const filtered = status_list?.filter(
        (status) => status.id === data.id && status.status_details.mark_archived == true,
      );
      setIsArchived(filtered?.length > 0 ? true : false);
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selectedId === id;

  const handleClear = () => {
    setSelected('');
    setSelectedId(0);
    handleClose();
  };
  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={handleClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong style={{ color: '#627daf' }}>Select a Status</strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close style={{ fontSize: 30, color: '#627daf' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <TableContainer className={classes.container}>
        {forPlaybook ? (
          <Table
            classes={classes.table}
            className="porjectTable"
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
            stickyHeader
          >
            <TableHead>
              <StyledTableRow className={classes.root}>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Label</StyledTableCell>
                <StyledTableCell>System Status</StyledTableCell>
                <StyledTableCell>Mark Archived</StyledTableCell>
                <StyledTableCell>Mark Completed</StyledTableCell>
                <StyledTableCell>Positive</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {
                //     stableSort(
                //     rows.length > 0 ? rows : [],
                //     getComparator(order, orderBy)
                // )
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                status.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <StyledTableRow
                      role={'checkbox'}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <StyledTableCell padding={'checkbox'}>
                        <Radio
                          checked={selectedId === row.id}
                          onChange={() => handleClick(row)}
                          value={row.id}
                          style={{ color: '#6385b7' }}
                          inputProps={{ 'aria-labelledby': labelId }}
                          className={`radio-btn-${index}`}
                        />
                      </StyledTableCell>
                      <StyledTableCell>{row.custom_label}</StyledTableCell>
                      <StyledTableCell>{row.system_status}</StyledTableCell>
                      <StyledTableCell>{row.mark_archived ? 'True' : 'False'}</StyledTableCell>
                      <StyledTableCell>{row.mark_completed ? 'True' : 'False'}</StyledTableCell>
                      <StyledTableCell>{row.positive ? 'True' : 'False'}</StyledTableCell>
                    </StyledTableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        ) : (
          <Table
            classes={classes.table}
            className="porjectTable p-2"
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
            stickyHeader
          >
            <TableHead>
              <StyledTableRow className={classes.root}>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Label</StyledTableCell>
                <StyledTableCell>Archive</StyledTableCell>
                <StyledTableCell>Closed</StyledTableCell>
                {/* <StyledTableCell>Positive</StyledTableCell> */}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {
                //     stableSort(
                //     rows.length > 0 ? rows : [],
                //     getComparator(order, orderBy)
                // )
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                status_list.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <StyledTableRow
                      role={'checkbox'}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <StyledTableCell padding={'checkbox'}>
                        <Radio
                          checked={selectedId === row.id}
                          onChange={() => handleClick(row)}
                          value={row.id}
                          style={{ color: '#6385b7' }}
                          inputProps={{ 'aria-labelledby': labelId }}
                          className={`radio-btn-${index}`}
                        />
                      </StyledTableCell>
                      <StyledTableCell>{row.custom_label}</StyledTableCell>
                      <StyledTableCell>
                        {row.status_details.mark_archived ? (
                          <Check style={{ color: 'green' }} />
                        ) : (
                          <Close style={{ color: 'grey' }} />
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.status_details.mark_completed ? (
                          <Check style={{ color: 'green' }} />
                        ) : (
                          <Close style={{ color: 'grey' }} />
                        )}
                      </StyledTableCell>
                      {/* <StyledTableCell>
                        {row.status_details.positive ? "True" : "False"}
                      </StyledTableCell> */}
                    </StyledTableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        )}
      </TableContainer>
      {selected && (
        <EnhancedTableToolbar
          numSelected={selected}
          selected_id={selectedId}
          board={board}
          close={handleClear}
          isPlaybook={forPlaybook}
          isArchived={isArchived}
        />
      )}
    </Dialog>
  );
}

export default React.memo(StatusTableModal);
