import React from 'react';
import AllTasksView from '../../LiteUIComponents/AllTasksView';
import { Grid } from '@mui/material';
import ContentTab from './ContentTab';
import Footer from '../Footer';
import { useSelector } from 'react-redux';

function Main() {
  const tasks = useSelector((state) => state.singleCardData);
  const taskData = tasks?.data?.length > 0 ? tasks?.data?.[0] : [];
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        md={3}
        lg={3}
      >
        <AllTasksView />
        <Footer data={taskData} />
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
