import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, Typography, Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { requestSubDomainProp } from '../Redux/Actions/create-tenant';
import HttpClient from '../Api/HttpClient';
function LinearProgressWithLabel(props) {
  const { closeModal, value } = props;
  const isDomainReady = useSelector((state) => state.subDomainProp);
  const doNavigate = () => {
    closeModal();
    window.open(`/superuser/:${HttpClient?.uuid}`, '_self');
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {value <= 99 ? (
        <>
          <p>Your domain is being setup, this usually takes 10 seconds.</p>
          <br />
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress
              style={{ height: 30, borderRadius: 30 }}
              variant="determinate"
              value={100}
              {...props}
            />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >{`${Math.round(value)}% completed`}</Typography>
          </Box>
        </>
      ) : isDomainReady?.data?.details === 'ready' ? (
        <Button
          variant="outlined"
          style={{ textTransform: 'none', border: '2px solid #627daf' }}
          onClick={doNavigate}
        >
          Next
        </Button>
      ) : (
        <Button
          variant="outlined"
          style={{ textTransform: 'none', border: '2px solid #627daf' }}
          onClick={props?.doRefresh}
        >
          Refresh
        </Button>
      )}
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function LinearProgressModal({ close }) {
  const [progress, setProgress] = React.useState(0);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (progress <= 0) refresh();
  }, []);

  const refresh = () => {
    if (progress >= 99) {
      setProgress(0);
    }
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        // (prevProgress >= 100 ? 0 : prevProgress + 10)
        if (prevProgress >= 99) {
          clearInterval(timer);
        }
        return prevProgress + 1;
      });
    }, 100);
    setTimeout(() => {
      dispatch(requestSubDomainProp({ uuid: HttpClient.uuid }));
    }, 5000);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel
        value={progress}
        closeModal={close}
        doRefresh={refresh}
      />
    </Box>
  );
}
