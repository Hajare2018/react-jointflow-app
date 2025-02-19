import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SlackIcon from '../../assets/icons/slack_icon.png';
import { FaHubspot, FaSalesforce } from 'react-icons/fa';
import Features from './Features';
import { useDispatch } from 'react-redux';
import { getConnectedCrms } from '../../Redux/Actions/crm-data';
import Form from './Form';
import GoogleIcon from '../../assets/icons/google-full.webp';
import outlookMail from '../../assets/icons/outlook-mail.png';
import genericMail from '../../assets/icons/generic-email.png';
import MsCrm from '../../assets/icons/image.png';
import { useTenantContext } from '../../context/TenantContext';

function Apps() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [logo, setLogo] = useState(null);
  const { smtp_server } = useTenantContext();
  const handleUserDetails = (img) => {
    setLogo(img);
    setShow(!show);
  };

  useEffect(() => {
    setLogo(
      smtp_server?.value_text == 'google'
        ? GoogleIcon
        : smtp_server?.value_text == 'outlook'
          ? outlookMail
          : smtp_server?.value_text == 'generic'
            ? genericMail
            : genericMail,
    );
  }, [smtp_server]);

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
            featureIcon={
              <img
                src={logo}
                className="h-9 w-9"
                loading="lazy"
              />
            }
            title={'Mail'}
            handleFeature={() => handleUserDetails(logo)}
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
            featureIcon={<FaSalesforce style={{ height: 50, width: 50, color: '#009EDB' }} />}
            title={'Salesforce'}
            background={'#e7ecf1'}
            handleFeature={() => dispatch(getConnectedCrms({ crm: 'salesforce' }))}
          />
        </Grid>
        <Grid
          item
          direction="column"
          xs={12}
          md={6}
        >
          <Features
            featureIcon={<FaHubspot style={{ height: 50, width: 50, color: '#fa7820' }} />}
            title={'Hubspot'}
            background={'#e7ecf1'}
            handleFeature={() => dispatch(getConnectedCrms({ crm: 'hubspot' }))}
          />
        </Grid>
        <Grid
          item
          direction="column"
          xs={12}
          md={6}
        >
          <Features
            featureIcon={
              <img
                src={SlackIcon}
                className="h-9 w-9"
                loading="lazy"
              />
            }
            title={'Slack'}
            background={'#e7ecf1'}
            handleFeature={() => dispatch(getConnectedCrms({ crm: 'slack' }))}
          />
        </Grid>
        <Grid
          item
          direction="column"
          xs={12}
          md={6}
        >
          <Features
            featureIcon={
              <img
                src={MsCrm}
                className="h-9 w-9"
                loading="lazy"
              />
            }
            title={'MS Dynamic 365'}
            background={'#e7ecf1'}
            handleFeature={() => dispatch(getConnectedCrms({ crm: 'mscrm' }))}
          />
        </Grid>
      </Grid>
      <Form
        open={show}
        handleClose={handleUserDetails}
        logo={logo}
        account={smtp_server?.value_text}
      />
    </div>
  );
}

export default React.memo(Apps);
