import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import AddNewCompany from './Companies/AddNewCompany';

const useStyles = makeStyles({
  root: {
    '& .MuiDialogTitle-root': {
      fontSize: 18,
      fontWeight: '600',
    },
  },
});

export default function NewCompanyDialog({ open, handleClose, company }) {
  const classes = useStyles();
  const [openForm, setOpenForm] = useState(false);
  const toggleCompanyForm = () => {
    setOpenForm(!openForm);
    if (openForm) {
      handleClose();
    }
  };
  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          className={classes.root}
          id="alert-dialog-title"
        >
          The company entered doesn&apos;t exist, would you like to create it?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
          >
            NO
          </Button>
          <Button
            onClick={toggleCompanyForm}
            color="primary"
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
      <AddNewCompany
        open={openForm}
        handleClose={toggleCompanyForm}
        data={{ company_name: company }}
      />
    </>
  );
}
