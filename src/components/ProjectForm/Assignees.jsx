import { AppBar, Dialog, Toolbar, IconButton, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close, ViewComfy } from '@mui/icons-material';
import React, { useState } from 'react';
import { getDevice } from '../Utils';
import AssigneeHistory from './AssigneeHistory';
import AssigneeTable from './AssigneeTable';
import { FaListUl } from 'react-icons/fa';

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

function Assignees({
  open,
  handleClose,
  card,
  assignment_type,
  recent_data,
  history,
  updates,
  dealPolice,
}) {
  const classes = useStyles();
  const [selected, setSelected] = useState('');
  const [display, setDisplay] = useState('list_view');
  const handleSelected = (e) => {
    setSelected(e);
  };
  const clearSelected = () => {
    setSelected('');
    handleClose();
  };
  const toggleDisplay = (view) => {
    setDisplay(view);
  };
  const isMobile = getDevice();
  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      open={open}
      onClose={clearSelected}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="d-flex justify-space-between">
          {(history || selected !== '') && (
            <strong>
              {history ? 'Assignment history' : `Assigning this task to:  ${selected}`}
            </strong>
          )}
          {!isMobile && !history && (
            <div className="d-flex">
              <div
                className="d-flex justify-centre left-btn"
                style={{
                  backgroundColor: display === 'list_view' ? '#6385b7' : '#dadde9',
                }}
              >
                <Tooltip
                  title={'Show List View'}
                  placement="top"
                  arrow
                >
                  <IconButton onClick={() => toggleDisplay('list_view')}>
                    <FaListUl
                      style={{
                        color: display === 'list_view' ? '#ffffff' : '#6385b7',
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
              <div
                className="d-flex justify-centre right-btn"
                style={{
                  backgroundColor: display === 'grid_view' ? '#6385b7' : '#dadde9',
                }}
              >
                <Tooltip
                  title={'Show Grid View'}
                  placement="top"
                  arrow
                >
                  <IconButton onClick={() => toggleDisplay('grid_view')}>
                    <ViewComfy
                      style={{
                        color: display === 'grid_view' ? '#ffffff' : '#6385b7',
                        height: 30,
                        width: 30,
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
          <IconButton
            edge="start"
            color="inherit"
            onClick={clearSelected}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      {history ? (
        <AssigneeHistory
          cardId={card.taskId}
          assignee_type={assignment_type}
        />
      ) : (
        <AssigneeTable
          view={display}
          card_data={card}
          assignee_type={assignment_type}
          close={clearSelected}
          updated_data={recent_data}
          selected_user={handleSelected}
          updateBy={updates}
          police={dealPolice}
          reassignment={false}
        />
      )}
    </Dialog>
  );
}

export default React.memo(Assignees);
