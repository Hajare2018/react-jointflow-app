import { Dialog, Grid, Paper, Slide } from '@mui/material';
import React from 'react';
import DocVersionList from './DocVersionList';
import { useDispatch, useSelector } from 'react-redux';
import DocumentHeader from './DocumentHeader';
import DetailsTab from './DetailsTab';
import { fetchData } from '../../../../Redux/Actions/store-data';

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

function DocumentDetails({ open, handleClose, tab }) {
  const dispatch = useDispatch();
  const documents_data = useSelector((state) => state?.singleCardDocs);
  const data = documents_data?.data?.length > 0 ? documents_data?.data : [];
  const doCloseDialog = () => {
    dispatch(fetchData([]));
    handleClose();
  };
  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={open}
      onClose={doCloseDialog}
      TransitionComponent={Transition}
      keepMounted
    >
      <Paper style={{ height: '93vh' }}>
        <Grid
          container
          direction="row"
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            style={{ backgroundColor: '#f7f8fb' }}
          >
            <DocVersionList data={data} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={9}
          >
            <div>
              <DocumentHeader />
              <DetailsTab selectedTab={tab} />
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Dialog>
  );
}

export default React.memo(DocumentDetails);
