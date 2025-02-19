import { Grid } from '@mui/material';
import React from 'react';
import ForecastCharts from './ForecastCharts';
import Widget2 from './Widget2';
import Widget3 from './Widget3';
import MyTasks from '../../pages/MyTasks/MyTasks';

function HomeWidgets({ view }) {
  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
      >
        <ForecastCharts view={view} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
      >
        {view === 'sales_forecast' || view === 'monthly_view' || view === 'default' ? (
          <Widget2 />
        ) : view === 'sales_exec' ? (
          <MyTasks onHome />
        ) : (
          ''
        )}
      </Grid>
      {(view === 'sales_forecast' || view === 'monthly_view' || view === 'default') && (
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
        >
          <Widget3 />
        </Grid>
      )}
    </Grid>
  );
}

export default React.memo(HomeWidgets);
