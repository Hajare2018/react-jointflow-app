import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { DescriptionOutlined, InfoOutlined, LibraryAddCheckOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { handleTabsChange } from '../../../../Redux/Actions/tab-values';
import AddTasksModal from '../AddTasksModal';
import Steps from '../../../ProjectForm/Steps';
import Documents from '../../../DocumentsType/AllTabs/Documents';
import { useTenantContext } from '../../../../context/TenantContext';

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
    style={{ position: 'sticky', top: '10%' }}
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

function AdditionalTableTabs({ close, forAdd }) {
  const classes = useStyles();
  // TODO FIXME value never used why?
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const tab_value = useSelector((state) => state.tabValues);
  const { activate_steplist } = useTenantContext();

  const handleChange = (event, newValue) => {
    dispatch(handleTabsChange(newValue));
    setValue(newValue);
  };

  // TODO FIXME what is this?
  useEffect(() => {}, [tab_value]);

  return (
    <div className={`${classes.root} tabHeaderWrap`}>
      <AppBar
        position="sticky"
        color="default"
      >
        <StyledTabs
          value={tab_value.value}
          onChange={handleChange}
          aria-label="full width tabs example"
        >
          <StyledTab
            label={
              tab_value.value === 0 ? (
                <div className="d-flex">
                  <InfoOutlined className="tab-icon-size" />{' '}
                  <span className="text-centre">Task Info</span>
                </div>
              ) : (
                <div className="d-flex">
                  <InfoOutlined className="tab-icon-size" />{' '}
                  <span className="text-centre">Task Info</span>
                </div>
              )
            }
          />
          <StyledTab
            label={
              <div className="d-flex">
                <DescriptionOutlined className="tab-icon-size" />{' '}
                <span className="text-centre">Documents</span>
              </div>
            }
          />
          {activate_steplist && (
            <StyledTab
              label={
                <div className="d-flex">
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
        <AddTasksModal
          handleClose={close}
          forAdd={forAdd}
        />
      </TabPanel>
      <TabPanel
        className="tab-panel tabPanelWrap"
        value={tab_value.value}
        index={1}
      >
        <Documents forTaskTypes={false} />
      </TabPanel>
      {activate_steplist && (
        <TabPanel
          className="tabPanelWrap"
          value={tab_value.value}
          index={2}
        >
          <div
            style={{ height: 600 }}
            className="p-3"
          >
            <Steps forTemplates />
          </div>
        </TabPanel>
      )}
    </div>
  );
}

export default React.memo(AdditionalTableTabs);
