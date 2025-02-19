import { Grid } from '@mui/material';
import React, { useState } from 'react';
import { VerifiedUser, VpnKey } from '@mui/icons-material';
import VerificationDialog from './VerificationDialog';
import { useDispatch } from 'react-redux';
import putSecretUrl from '../../Redux/Actions/mfa';
import Features from './Features';
import { useUserContext } from '../../context/UserContext';

export default function Security() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const { user } = useUserContext();
  const handleVerificationModal = () => {
    dispatch(putSecretUrl());
    setShowModal(!showModal);
  };
  return (
    <div style={{ padding: '50px 30px' }}>
      <Grid
        container
        spacing={3}
        direction="row"
      >
        <Grid
          item
          direction="column"
          xs={12}
          md={6}
        >
          <Features
            featureIcon={<VpnKey style={{ color: '#627daf', height: 30, width: 30 }} />}
            title={'Change Password'}
            notes={'Last Changed 30-06-2021'}
            handleFeature={() => window.open(`/reset_password/?usr=${user?.id}`, '_blank')}
            background={'#e7ecf1'}
          />
        </Grid>
        <Grid
          item
          direction="column"
          xs={12}
          md={6}
        >
          <Features
            featureIcon={<VerifiedUser style={{ height: 30, width: 30, color: '#627daf' }} />}
            title={'Multi Factor Authentication'}
            handleFeature={handleVerificationModal}
            background={'#e7ecf1'}
          />
        </Grid>
      </Grid>
      <VerificationDialog
        open={showModal}
        handleClose={handleVerificationModal}
        showQr
      />
    </div>
  );
}
