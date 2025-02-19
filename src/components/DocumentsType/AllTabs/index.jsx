import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { DescriptionOutlined, InfoOutlined, LibraryAddCheckOutlined } from '@mui/icons-material';
import TaskTypeInfo from './TaskTypeInfo';
import Documents from './Documents';
import Loader from '../../Loader';
import { getDocsList } from '../../../Redux/Actions/document-upload';
import { show } from '../../../Redux/Actions/loader';
import TaskTypeSteps from './TaskTypeSteps';
import { useTenantContext } from '../../../context/TenantContext';

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

const useStyles = makeStyles((_theme) => ({
  root: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    maxHeight: 800,
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

function AllTabs({ add, close }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const doc_type = useSelector((state) => state.documentsTypeData);
  const loader = useSelector((state) => state.showLoader);
  const keep_data = useSelector((state) => state.keepThis);
  const { activate_steplist } = useTenantContext();

  const handleChange = (event, newValue) => {
    // dispatch(handleTabsChange(newValue));
    setValue(newValue);
    if (newValue === 1) {
      dispatch(show(true));
      dispatch(
        getDocsList({
          fetchByTaskType: true,
          type_id: doc_type?.data?.[0]?.id,
          archived: false,
        }),
      );
    }
  };

  return (
    <div className={`${classes.root} tabHeaderWrap`}>
      <AppBar
        position="static"
        color="transparent"
      >
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="full width tabs example"
        >
          <StyledTab
            label={
              value === 0 ? (
                <div className="d-flex">
                  <InfoOutlined className="tab-icon-size" />{' '}
                  <span className="text-centre">Task Type Info</span>
                </div>
              ) : (
                <div className="d-flex">
                  <InfoOutlined className="tab-icon-size" />{' '}
                  <span className="text-centre">Task Type Info</span>
                </div>
              )
            }
          />
          <StyledTab
            style={{ display: !keep_data?.show && 'none' }}
            label={
              <div className="d-flex">
                <DescriptionOutlined className="tab-icon-size" />{' '}
                <span className="text-centre">Documents</span>
              </div>
            }
          />
          <StyledTab
            style={{
              display: (!keep_data?.show || !activate_steplist) && 'none',
            }}
            label={
              <div className="d-flex">
                <LibraryAddCheckOutlined className="tab-icon-size" />{' '}
                <span className="text-centre">Steps</span>
              </div>
            }
          />
        </StyledTabs>
        <TabPanel
          className="tab-panel tabPanelWrap"
          value={value}
          index={0}
        >
          {loader.show ? (
            <Loader />
          ) : (
            <TaskTypeInfo
              forAdd={add}
              closeModal={close}
            />
          )}
        </TabPanel>
        <TabPanel
          className="tab-panel tabPanelWrap"
          value={value}
          index={1}
        >
          <Documents
            id={doc_type?.data?.[0]?.id}
            forTaskTypes
          />
        </TabPanel>
        <TabPanel
          className="tab-panel"
          value={value}
          index={2}
        >
          <TaskTypeSteps id={doc_type?.data?.[0]?.id} />
        </TabPanel>
      </AppBar>
    </div>
  );
}

export default React.memo(AllTabs);
