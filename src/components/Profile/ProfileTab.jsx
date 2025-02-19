import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Apps, Person, VerifiedUser } from '@mui/icons-material';
import EditProfile from './EditProfile';
import Security from './Security';
import AppsTab from './Apps';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
      id={`full-width-tabpanel-${index}`}
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

const useStyles = makeStyles((_theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& header ': {
      backgroundColor: 'transparent',
    },
    '& .MuiBox-root': {
      padding: 0,
    },
  },
}));

const StyledTabs = withStyles({
  root: {
    borderBottom: '5px grey',
    height: 60,
    '& .MuiTabs-flexContainer': {
      flexWrap: 'wrap',
    },
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 100,
      width: '100%',
      backgroundColor: '#ef3d48',
      color: '#ef3d48',
      borderBottomColor: '#ef3d48',
      borderBottomStyle: 'solid',
    },
  },
})((props) => (
  <Tabs
    className="tabWrap"
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
    marginLeft: theme.spacing(2),
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center',
    '&:hover': {
      color: '#ef3d48',
      opacity: 2,
      fontWeight: theme.typography.fontWeightBold,
    },
    '&.Mui-selected': {
      outline: 'none',
      color: '#ef3d48',
      fontWeight: theme.typography.fontWeightBold,
    },
    '&:selected': {
      color: '#ef3d48',
      fontWeight: theme.typography.fontWeightBold,
    },
    '&:focus': {
      color: '#ef3d48',
      outline: 'none',
      fontWeight: theme.typography.fontWeightBold,
    },
  },
}))((props) => (
  <Tab
    disableRipple
    {...props}
  />
));

export default function ProfileTab() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          // height: 50,
          boxShadow: 'none',
          marginBottom: 24,
          borderBottom: '1px solid #ccc',
        }}
        color="default"
      >
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="full width tabs example"
        >
          <StyledTab
            label={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Person /> <span style={{ marginLeft: 8 }}>Profile</span>
              </div>
            }
          />
          <StyledTab
            label={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <VerifiedUser /> <span style={{ marginLeft: 8 }}>Security</span>
              </div>
            }
          />
          <StyledTab
            label={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Apps /> <span style={{ marginLeft: 8 }}>Apps</span>
              </div>
            }
          />
        </StyledTabs>
      </AppBar>
      <TabPanel
        className="tab-panel"
        value={value}
        index={0}
      >
        <EditProfile />
      </TabPanel>
      <TabPanel
        value={value}
        index={1}
      >
        <Security />
      </TabPanel>
      <TabPanel
        value={value}
        index={2}
      >
        <AppsTab />
      </TabPanel>
    </div>
  );
}
