import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {
  ChatOutlined,
  DescriptionOutlined,
  InfoOutlined,
  LibraryAddCheckOutlined,
} from '@mui/icons-material';
import TaskInfo from './TaskInfo';
import Documents from './Documents';
import { useDispatch, useSelector } from 'react-redux';
import { handleTabsChange } from '../../Redux/Actions/tab-values';
import Steps from './Steps';
import { useTenantContext } from '../../context/TenantContext';
import Timelines from './Timelines';
import { getComments } from '../../Redux/Actions/comments';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && (
        <Box
          style={{ height: '100%' }}
          p={3}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

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
      backgroundColor: '#3edab7',
      color: '#3edab7',
      borderBottom: 15,
      borderBottomColor: '#3edab7',
      borderBottomStyle: 'solid',
    },
  },
})((props) => (
  <Tabs
    variant="fullWidth"
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
      color: '#3edab7',
      opacity: 2,
    },
    '&.Mui-selected': {
      outline: 'none',
      color: '#3edab7',
    },
    '&:selected': {
      color: '#3edab7',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#3edab7',
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

function FormTabs({ formData, onClose, fromAdd, isClone }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tab_value = useSelector((state) => state.tabValues);
  const { activate_steplist } = useTenantContext();

  const handleChange = (_event, newValue) => {
    dispatch(handleTabsChange(newValue));
    if (newValue === 2) {
      dispatch(getComments({ id: formData?.id, client_visible: false }));
    } else if (newValue === 3) {
      dispatch(getComments({ id: formData?.id, client_visible: true }));
    }
  };

  return (
    <div className={`${classes.root} tabHeaderWrap`}>
      <AppBar
        position="static"
        color="default"
      >
        <StyledTabs
          value={tab_value.value}
          onChange={handleChange}
          aria-label="full width tabs example"
        >
          <StyledTab
            label={
              <div className="flex items-center">
                <InfoOutlined className="tab-icon-size" />{' '}
                <span className="text-centre">Task Info</span>
              </div>
            }
          />
          <StyledTab
            style={{ display: (fromAdd || isClone) && 'none' }}
            label={
              <div className="flex items-center">
                <DescriptionOutlined className="tab-icon-size" />{' '}
                <span className="text-centre">Documents</span>
              </div>
            }
          />
          <StyledTab
            style={{ display: (fromAdd || isClone) && 'none' }}
            label={
              <div className="flex items-center">
                <ChatOutlined className="tab-icon-size" />{' '}
                <span className="text-centre">Internal</span>
              </div>
            }
          />
          <StyledTab
            style={{ display: (fromAdd || isClone) && 'none' }}
            label={
              <div className="flex items-center">
                <ChatOutlined className="tab-icon-size" />{' '}
                <span className="text-centre">External</span>
              </div>
            }
          />
          {activate_steplist && (
            <StyledTab
              style={{ display: (fromAdd || isClone) && 'none' }}
              label={
                <div className="flex items-center">
                  <LibraryAddCheckOutlined className="tab-icon-size" />{' '}
                  <span className="text-centre">Steps</span>
                </div>
              }
            />
          )}
        </StyledTabs>
      </AppBar>
      <TabPanel
        className="tab-panel tabPanelWrap"
        value={tab_value.value}
        index={0}
      >
        <TaskInfo
          formData={formData}
          toClose={onClose}
          forAdd={fromAdd}
          isClone={isClone}
        />
      </TabPanel>
      <TabPanel
        className="tab-panel tabPanelWrap"
        value={tab_value.value}
        index={1}
      >
        <Documents
          tableData={formData}
          toClose={onClose}
        />
      </TabPanel>
      <TabPanel
        className="tab-panel tabPanelWrap"
        value={tab_value.value}
        index={2}
      >
        <Timelines
          cardData={formData}
          toClose={onClose}
          visibleToClient={false}
        />
      </TabPanel>
      <TabPanel
        className="tab-panel tabPanelWrap"
        value={tab_value.value}
        index={3}
      >
        <Timelines
          cardData={formData}
          toClose={onClose}
          visibleToClient={true}
        />
      </TabPanel>
      {activate_steplist && (
        <TabPanel
          className="tab-panel tabPanelWrap"
          value={tab_value.value}
          index={4}
        >
          <Steps
            toClose={onClose}
            fromTaskEditor
          />
        </TabPanel>
      )}
    </div>
  );
}

export default FormTabs;
