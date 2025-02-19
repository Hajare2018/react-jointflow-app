import React, { useEffect } from 'react';
import Header from '../components/CompanyView/Components/Header';
import Main from '../components/CompanyView/Components/Main';
import { useDispatch, useSelector } from 'react-redux';
import { requestGroupView } from '../Redux/Actions/user-access';
import { getVendorDetails } from '../Redux/Actions/login';
import { getUser } from '../Redux/Actions/user-info';
import HttpClient from '../Api/HttpClient';
import { postReactivationData } from '../Redux/Actions/nudge-mail';
import { Box, Button } from '@mui/material';

const style = {
  position: 'absolute',
  padding: 20,
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  border: '2px solid #627daf',
  borderRadius: '0.5rem',
  boxShadow: 24,
  p: 4,
};

function CompanyView() {
  const pathname = new URL(window.location.href);
  const dialog = useSelector((state) => state.dialog);
  const dispatch = useDispatch();
  useEffect(() => {
    const company_id = new URLSearchParams(pathname.search).get('company');
    dispatch(requestGroupView({ id: company_id }));
    dispatch(getUser({ fetchPermissions: false, isLightUser: true }));
    dispatch(getVendorDetails());
  }, []);

  const sendAccessLink = () => {
    const reqBody = {
      jwt_token: HttpClient.api_token(),
      context: 'companyview',
    };
    dispatch(postReactivationData({ token: reqBody }));
  };

  return (
    <div style={{ backgroundColor: '#F1F1F1', padding: 20 }}>
      {dialog?.show ? (
        <Box style={style}>
          <strong>Session Expired!</strong>
          <p>Your access has expired, click to receive a new access link.</p>
          <br />
          <Button
            variant="outlined"
            style={{ textTransform: 'none' }}
            onClick={sendAccessLink}
          >
            Get access email
          </Button>
        </Box>
      ) : (
        <div>
          <Header />
          <Main />
          {/* <Footer
        // data={taskData}
        /> */}
        </div>
      )}
    </div>
  );
}

export default React.memo(CompanyView);
