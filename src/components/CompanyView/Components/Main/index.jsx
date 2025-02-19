import React from 'react';
import { Grid } from '@mui/material';
import ContentTab from './ContentTab';
import AllCompaniesView from './AllCompaniesView';

function Main() {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        md={3}
        lg={3}
      >
        <AllCompaniesView />
      </Grid>
      <Grid
        item
        xs={12}
        md={9}
        lg={9}
      >
        <ContentTab />
      </Grid>
    </Grid>
  );
}

export default React.memo(Main);
