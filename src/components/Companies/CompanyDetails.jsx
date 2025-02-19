import { Avatar, Box, Button, Dialog, DialogActions, Tab, Tabs, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles, withStyles } from '@mui/styles';
import './style.css';
import industries from './IndustryList';
import { createImageFromInitials, getDevice } from '../Utils';
import AddNewUser from '../Users/AddNewUser';
import CompanyUsers from './CompanyUsers';
import NewTab from '../../assets/icons/OpenNewTabIconBlue.png';
import { SyncAlt } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  putCompany,
  requestCompanyFavIcon,
  requestCompanyHierarchy,
} from '../../Redux/Actions/companies';
import { show } from '../../Redux/Actions/loader';
import CompanyHierarchy from './CompanyHierarchy';
import { requestUserHierarchy } from '../../Redux/Actions/user-access';
import HttpClient from '../../Api/HttpClient';
import ProjectsByCompany from './ProjectsByCompany';
import { requestProjectsByCompany } from '../../Redux/Actions/documents-data';

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box style={{ height: 'auto' }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const StyledTabs = withStyles({
  root: {
    borderBottom: '5px grey',
    '& .MuiTabs-flexContainer': {
      flexWrap: 'wrap',
    },
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 120,
      width: '100%',
      backgroundColor: '#627daf',
      color: '#627daf',
      borderBottom: 15,
      borderBottomColor: '#627daf',
      borderBottomStyle: 'solid',
    },
  },
})((props) => (
  <Tabs
    variant="standard"
    {...props}
    TabIndicatorProps={{ children: <span /> }}
  />
));

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#555555',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: 16,
    marginRight: theme.spacing(0),
    '&:hover': {
      color: '#627daf',
      opacity: 2,
    },
    '&.Mui-selected': {
      outline: 'none',
      color: '#627daf',
    },
    '&:selected': {
      color: '#627daf',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#627daf',
      outline: 'none',
    },
  },
}))((props) => (
  <Tab
    className="tabtxtsize"
    style={props.style}
    disableRipple
    {...props}
  />
));

function CompanyDetails({ open, handleClose, data }) {
  const dispatch = useDispatch();
  const companyData = useSelector((state) => state.companyData);
  const details = companyData?.data?.length > 0 ? companyData?.data?.[0] : [];
  const allCompaniesData = useSelector((state) => state?.companiesData);
  const company_list = allCompaniesData?.data?.length > 0 ? allCompaniesData?.data : [];
  const { id } = data;
  const classes = useStyles();
  const [form, setForm] = useState({
    companyName: '',
    industryType: '',
    websiteUrl: '',
    parentCompany: 0,
  });

  const [openForm, setOpenForm] = useState(false);
  const [value, setValue] = React.useState(0);

  useEffect(() => {}, [form.companyName, form.industryType, form.websiteUrl, form.parentCompany]);

  useEffect(() => {
    setValue(0);
    setForm({
      companyName: details?.name,
      industryType: details?.industry,
      websiteUrl: details?.website_url,
      parentCompany: details?.parent_company,
    });
  }, [companyData]);

  const handleClear = () => {
    setForm({
      companyName: '',
      industryType: '',
      websiteUrl: '',
      parentCompany: 0,
    });
    handleClose();
  };

  const addNewUser = () => {
    setOpenForm(!openForm);
  };

  const closeForm = () => {
    setOpenForm(!openForm);
  };

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const doRefreshIcon = () => {
    dispatch(requestCompanyFavIcon({ id: details?.id }));
  };

  const updateCompanyDetails = () => {
    dispatch(show(true));
    let formData = new FormData();
    formData.append('name', form.companyName);
    formData.append('seller_company', 1);
    formData.append('website_url', form.websiteUrl);
    formData.append('industry', form.industryType);
    form.parentCompany !== null &&
      formData.append(
        'parent_company',
        isNaN(form.parentCompany) ? '' : parseInt(form.parentCompany),
      );
    dispatch(putCompany({ id: details?.id, data: formData }));
  };

  const handleChange = (event, newValue) => {
    if (newValue == 1) {
      dispatch(requestCompanyHierarchy({ id: id }));
    } else if (newValue == 2) {
      dispatch(requestCompanyHierarchy({ id: id }));
      dispatch(requestUserHierarchy({ company_id: details?.id }));
    } else if (newValue == 3) {
      dispatch(requestProjectsByCompany({ company_id: details?.id }));
    }
    setValue(newValue);
  };

  const isMobile = getDevice();
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={open}
      >
        <div style={{ position: 'sticky', top: 0, zIndex: 999 }}>
          <AppBar className={classes.appBar}>
            <Toolbar className="justify-space-between">
              <Tooltip
                title={`Company ID = ${id}`}
                placement="right"
                arrow
              >
                <div className="d-flex">
                  <Avatar>
                    <img
                      src={
                        data?.icon !== null
                          ? data?.icon
                          : createImageFromInitials(200, form.companyName, '#627daf')
                      }
                      className="img-lazy-avatar"
                      loading="lazy"
                    />
                  </Avatar>
                  <div style={{ width: 10 }} />
                  <Typography style={{ fontWeight: 'bold' }}>{form.companyName}</Typography>
                </div>
              </Tooltip>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClear}
                aria-label="close"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </IconButton>
            </Toolbar>
          </AppBar>
          <AppBar
            position="static"
            color="default"
          >
            <StyledTabs
              value={value}
              onChange={handleChange}
            >
              <StyledTab label={'Main Details'} />
              <StyledTab label={'Group Hierarchy'} />
              <StyledTab label={'Contact Hierarchy'} />
              <StyledTab label={'Projects'} />
              <StyledTab label={'External Group View'} />
            </StyledTabs>
          </AppBar>
        </div>
        <TabPanel
          value={value}
          index={0}
        >
          <div
            style={{
              display: 'flex',
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <label className="form-label">
                {isMobile ? 'Company Name'.substring(0, 10 - 3) + '...' : 'Company Name'}
              </label>
              <input
                type="text"
                className="text-input"
                value={form.companyName}
                onBlur={updateCompanyDetails}
                name="companyName"
                onChange={handleForm}
              />
            </div>
            <div className="selectbox">
              <label className="form-label">Parent Company</label>
              <select
                className="form-select"
                value={form.parentCompany}
                name="parentCompany"
                onBlur={() => {
                  if (form.parentCompany == null) {
                    return;
                  } else {
                    updateCompanyDetails();
                  }
                }}
                onChange={handleForm}
              >
                <option>Select</option>
                {company_list?.map((company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Website URL</label>
              <div className="flex">
                <input
                  type="text"
                  className="text-input"
                  value={form.websiteUrl}
                  onBlur={updateCompanyDetails}
                  name="websiteUrl"
                  onChange={handleForm}
                />
                <div className="d-flex-column justify-centre">
                  <Tooltip
                    title={'Open into New tab'}
                    placement="top"
                  >
                    <a
                      href={form.websiteUrl}
                      target="_blank"
                      type="button"
                      rel="noreferrer"
                    >
                      <img
                        src={NewTab}
                        className="h-3 w-3 m-1"
                      />
                    </a>
                  </Tooltip>
                  <Tooltip
                    title={'Refresh the icon'}
                    placement="bottom"
                  >
                    <div onClick={doRefreshIcon}>
                      <SyncAlt className="h-5 w-5 m-1" />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="selectbox">
              <label className="form-label">Industry</label>
              <input
                type="text"
                placeholder="Select an Industry"
                list="data"
                className="text-input"
                onBlur={updateCompanyDetails}
                value={form.industryType}
                name="industryType"
                onChange={handleForm}
              />
              <datalist id="data">
                {industries.map((item, key) => (
                  <option
                    key={key}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}
              </datalist>
            </div>
          </div>
          <CompanyUsers
            companyName={details?.name}
            filterByCompanies
          />
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
        >
          <CompanyHierarchy forGroup />
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
        >
          <CompanyHierarchy forContacts />
        </TabPanel>
        <TabPanel
          value={value}
          index={3}
        >
          <ProjectsByCompany />
        </TabPanel>
        <TabPanel
          value={value}
          index={4}
        >
          <div style={{ height: '92vh' }}>
            <iframe
              height={'100%'}
              width={'100%'}
              src={`${window.location.origin}/company_view/?company=${details?.id}&logo=${details?.company_image}&name=${details?.name}&token=${HttpClient.api_token()}`}
            />
          </div>
        </TabPanel>
        {(value == 0 || value == 2) && (
          <DialogActions>
            <Button
              onClick={addNewUser}
              style={{
                backgroundColor: '#627daf',
                color: '#ffffff',
                outline: 'none',
                fontSize: '1.3rem',
              }}
            >
              Add New Contact
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <AddNewUser
        forCompany={true}
        forEdit={data}
        handleClose={closeForm}
        open={openForm}
        addContact
      />
    </>
  );
}

export default React.memo(CompanyDetails);
