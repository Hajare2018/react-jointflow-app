import React from 'react';
import { getDevice } from '../../../Utils';
import { makeStyles } from '@mui/styles';
import CompanyList from './CompanyList';

const useStyles = makeStyles(() => ({
  avatar: {
    width: 40,
    height: 40,
    '&:hover': {
      transform: 'scale(2.00)',
    },
  },
  container: {
    height: '87vh',
    overflowY: 'auto',
    '@media(max-height: 2160px)': {
      maxHeight: `85.5vh`,
    },
    '@media(max-height: 1080px)': {
      maxHeight: `75vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `81vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `77.7vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `72vh`,
    },
  },
}));

function AllCompaniesView() {
  const classes = useStyles();
  const isMobile = getDevice();
  return (
    <div className={`card gap-3 ${classes.container} ${!isMobile && 'mr-3'}`}>
      <div className="d-flex-column justify-space-between">
        <strong className="app-color font-bold-20 m-2">Companies</strong>
        <CompanyList />
      </div>
    </div>
  );
}

export default React.memo(AllCompaniesView);
