import { Avatar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { createImageFromInitials } from '../Utils';
import { useTenantContext } from '../../context/TenantContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

function AssigneesAvatar({ src, company, seller, owner }) {
  const classes = useStyles();
  const { company_logo } = useTenantContext();
  return (
    <>
      {seller || owner ? (
        <img
          className={'company-img-page'}
          src={company_logo}
        />
      ) : (
        <img
          className={'company-img-page'}
          src={company?.company_image || createImageFromInitials(200, company?.name, '#627daf')}
        />
      )}
      <Avatar
        src={src?.avatar}
        className={classes.large}
      />
    </>
  );
}

export default React.memo(AssigneesAvatar);
