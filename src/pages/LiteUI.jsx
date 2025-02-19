import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../Redux/Actions/loader';
import getSingleTask from '../Redux/Actions/single-task';
import Loader from '../components/Loader';
import { Box, Button } from '@mui/material';
import { postReactivationData } from '../Redux/Actions/nudge-mail';
import { requestContentsList, requestProjectLiteView } from '../Redux/Actions/dashboard-data';
import Header from '../components/LiteUser/Components/Header';
import Main from '../components/LiteUser/Components/Main';
import { getVendorDetails } from '../Redux/Actions/login';
import { useUserContext } from '../context/UserContext';

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

function LiteUI() {
  const pathname = new URL(window.location.href);
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.singleCardData);
  const vendor = useSelector((state) => state.vendorData);
  const liteData = useSelector((state) => state.dashboardLiteData);
  let project = liteData?.data?.length > 0 ? liteData?.data?.[0] : [];
  const taskData = tasks?.data?.length > 0 ? tasks?.data?.[0] : [];
  const loader = useSelector((state) => state.showLoader);
  const { user, accessToken } = useUserContext();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const card_id = new URLSearchParams(pathname.search).get('task_id');
    const board = new URLSearchParams(pathname.search).get('board');
    localStorage.setItem('selected_id', card_id);
    dispatch(show(true));
    dispatch(
      getSingleTask({
        card_id:
          card_id == 0 && project?.maap_cards?.length > 0
            ? parseInt(project?.maap_cards?.[0]?.id)
            : card_id,
        task_info: false,
        maap_task: true,
      }),
    );
    dispatch(requestProjectLiteView({ board: board }));
    dispatch(getVendorDetails());
    dispatch(
      requestContentsList({
        id: board,
        fetchContent: false,
      }),
    );
  }, []);

  useEffect(() => {
    const tab_name = new URLSearchParams(pathname.search).get('tab');
    setTab(tab_name);
  }, [tab]);

  const sendAccessLink = () => {
    const reqBody = {
      jwt_token: accessToken,
    };
    dispatch(postReactivationData({ token: reqBody }));
  };

  return (
    <div style={{ backgroundColor: '#F1F1F1', padding: 20 }}>
      {loader.show ? (
        <Loader />
      ) : user ? (
        <div>
          <Header
            data={liteData?.data?.length > 0 ? liteData?.data?.[0] : []}
            vendor={vendor?.data}
          />
          <Main data={taskData} />
        </div>
      ) : (
        <Box style={style}>
          <strong>Session Expired!</strong>
          <p>Your access has expired, click to receive a new access link.</p>
          <br />
          <div className="d-flex justify-center">
            <Button
              variant="outlined"
              style={{ textTransform: 'none' }}
              onClick={sendAccessLink}
            >
              Get access email
            </Button>
          </div>
        </Box>
      )}
    </div>
  );
}

export default React.memo(LiteUI);
