import { Box, Tab, Tabs } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import { getDevice } from '../../../Utils';
import ProjectTable from './ProjectTable';

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
      {value === index && <Box style={{ height: '100%' }}>{children}</Box>}
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
      backgroundColor: '#6385b7',
      color: '#6385b7',
      borderBottom: 15,
      borderBottomColor: '#6385b7',
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
    fontWeight: 'bold',
    fontSize: `20px !important`,
    marginBottom: theme.spacing(0),
    '&:hover': {
      color: '#6385b7',
      opacity: 2,
    },
    '&.Mui-selected': {
      outline: 'none',
      color: '#6385b7',
    },
    '&:selected': {
      color: '#6385b7',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#6385b7',
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

function ContentTab() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const isMobile = getDevice();
  return (
    <>
      <div className={`d-flex card xl:mb-6 mb-4 ${!isMobile && 'ml-3'} ${isMobile && 'mt-4'}`}>
        <StyledTabs
          value={value}
          onChange={handleChange}
        >
          <StyledTab label={'Projects'} />
        </StyledTabs>
      </div>
      <TabPanel
        value={value}
        index={0}
      >
        <ProjectTable />
      </TabPanel>
      {/* <TabPanel value={value} index={1}>
        <GanttView />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Descriptions />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <DocumentsView lite />
      </TabPanel> */}
    </>
  );
}

export default React.memo(ContentTab);
