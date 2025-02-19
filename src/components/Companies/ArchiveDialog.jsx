import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { putCompany } from '../../Redux/Actions/companies';
import { show } from '../../Redux/Actions/loader';

const useStyles = makeStyles({
  root: {
    '& .MuiDialogTitle-root': {
      fontSize: 18,
      fontWeight: '600',
    },
  },
});

function ArchiveDialog({ open, handleClose, archiveData, archive }) {
  const { company_name, created_at, industry, e, website_url } = archiveData;
  const classes = useStyles();
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);

  const archiveCompany = () => {
    dispatch(show(true));
    let formData = new FormData();
    formData.append('name', company_name);
    formData.append('created_at', created_at);
    formData.append('seller_company', 1);
    formData.append('website_url', website_url);
    formData.append('industry', industry);
    formData.append('active', 'True');
    formData.append('archived', archive ? 'False' : 'True');
    dispatch(putCompany({ id: e, data: formData }));
    if (!loader.show) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        className={classes.root}
        id="alert-dialog-title"
      >
        {archive
          ? 'Are you sure to Unarchive this Company?'
          : 'Are you sure to archive this Company?'}
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
        >
          NO
        </Button>
        <Button
          onClick={archiveCompany}
          color="primary"
        >
          YES
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(ArchiveDialog);
