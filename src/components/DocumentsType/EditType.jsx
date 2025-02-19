import React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import '../ProjectForm/TaskInfo.css';
import './style.css';
import AllTabs from './AllTabs';
import { useDispatch, useSelector } from 'react-redux';
import { sendDocumentsType } from '../../Redux/Actions/documents-type';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
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

function EditType({ open, handleClose, forAdd, editData }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const saveData = useSelector((state) => state.reloadedData);
  const handleCloseModal = () => {
    if (forAdd && saveData?.data?.custom_label !== '') {
      dispatch(sendDocumentsType(saveData?.data));
    }
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
        aria-labelledby="form-dialog-title"
        onClose={handleCloseModal}
      >
        <AppBar className={classes.appBar}>
          <Toolbar className="justify-space-between">
            <Typography style={{ fontWeight: 'bold' }}>
              {forAdd ? 'Add Type' : 'Edit Type'}
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <AllTabs
          add={forAdd}
          close={handleClose}
          data={editData?.data}
        />
      </Dialog>
    </div>
  );
}

export default React.memo(EditType);
