import React from 'react';
import AssigneeTable from './ProjectForm/AssigneeTable';
import { AppBar, Dialog, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  appBar: {
    position: 'sticky',
    backgroundColor: '#ffffff',
    color: '#627daf',
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
}));

function UsersTable({ open, handleClose, board_data }) {
  const classes = useStyles();
  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      open={open}
      onClose={handleClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="d-flex justify-space-between">
          <strong>Reassign Project - {board_data?.name}</strong>
          {/* {!isMobile && !history && (
            <div className="d-flex">
              <div
                className="d-flex justify-centre left-btn"
                style={{
                  backgroundColor:
                    display === "list_view" ? "#6385b7" : "#dadde9",
                }}
              >
                <Tooltip title={"Show List View"} placement="top" arrow>
                  <IconButton onClick={() => toggleDisplay("list_view")}>
                    <FaIcons.FaListUl
                      style={{
                        color: display === "list_view" ? "#ffffff" : "#6385b7",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
              <div
                className="d-flex justify-centre right-btn"
                style={{
                  backgroundColor:
                    display === "grid_view" ? "#6385b7" : "#dadde9",
                }}
              >
                <Tooltip title={"Show Grid View"} placement="top" arrow>
                  <IconButton onClick={() => toggleDisplay("grid_view")}>
                    <ViewComfy
                      style={{
                        color: display === "grid_view" ? "#ffffff" : "#6385b7",
                        height: 30,
                        width: 30,
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )} */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <AssigneeTable
        view={'list_view'}
        assignee_type={{ internal: true }}
        reassignment={true}
        board={board_data?.id}
        close={handleClose}
      />
    </Dialog>
  );
}

export default React.memo(UsersTable);
