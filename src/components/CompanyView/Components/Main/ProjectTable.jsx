import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { getDevice } from '../../../Utils';
import TableComponent from './TableComponent';

const container = makeStyles({
  container: {
    maxHeight: `63vh`,
    overflowY: 'auto',
    '@media(max-height: 2160px)': {
      maxHeight: `72vh`,
    },
    '@media(max-height: 1080px)': {
      maxHeight: `72vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `65.7vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `62vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `51vh`,
    },
  },
});

function ProjectTable() {
  const classes = container();
  const isMobile = getDevice();
  return (
    <div className={`card ${!isMobile && 'ml-3'}`}>
      <Grid
        container
        direction="row"
        className="p-4"
      >
        <Grid
          className={classes.container}
          item
          xs={12}
          md={12}
          lg={12}
        >
          <TableComponent />
        </Grid>
      </Grid>
    </div>
  );
}

export default React.memo(ProjectTable);
