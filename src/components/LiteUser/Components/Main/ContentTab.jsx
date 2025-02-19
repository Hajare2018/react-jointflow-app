import { Box, Tab, Tabs } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import { getDevice } from '../../../Utils';
import TaskDetails from './AllTabs/TaskDetails';
import GanttView from './AllTabs/GanttView';
import Descriptions from './AllTabs/Descriptions';
import DocumentsView from './AllTabs/DocumentsView';
import { useDispatch, useSelector } from 'react-redux';
import { getDocsList } from '../../../../Redux/Actions/document-upload';
import { requestContentsList } from '../../../../Redux/Actions/dashboard-data';

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    // overflowY: "auto",
    // backgroundColor: "#ffffff",
    '@media(max-height: 2160px)': {
      maxHeight: `86.7vh`,
    },
    '@media(max-height: 1080px)': {
      maxHeight: `82.5vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `82.5vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `79.4vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `72vh`,
    },
  },
}));

function TabPanel(props) {
  const classes = useStyles();
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      className={classes.container}
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
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const contentsData = useSelector((state) => state.contentsData);
  const allContents = contentsData?.data?.cblocks;
  const allTabs = contentsData?.data?.tab_names;
  let url = new URL(window.location.href);
  const board = new URLSearchParams(url.search).get('board');
  const handleChange = (event, newValue) => {
    if (newValue == 2) {
      dispatch(
        getDocsList({
          fetchByBoard: true,
          board_id: board,
        }),
      );
    }
    if (newValue == 3) {
      dispatch(
        requestContentsList({
          id: board,
          fetchContent: false,
        }),
      );
    }
    setValue(newValue);
  };
  const isMobile = getDevice();
  const filterDataByTab = (data, tabName) => {
    return data.filter((item) => item.tab_name === tabName);
  };

  let tabArrays = [];

  allTabs?.forEach((tab) => {
    const tabs = tab.tab_name;
    tabArrays.push(filterDataByTab(allContents, tabs));
  });

  return (
    <>
      <div className={`d-flex card xl:mb-6 mb-4 ${!isMobile && 'ml-3'} ${isMobile && 'mt-4'}`}>
        <Tabs
          indicatorColor="primary"
          variant="scrollable"
          value={value}
          onChange={handleChange}
        >
          <StyledTab label={'Task Details'} />
          <StyledTab label={'Project View'} />
          <StyledTab label={'Documents'} />
          {allTabs?.map(
            (tab) =>
              tab.display && (
                <StyledTab
                  key={tab.tab_name}
                  label={tab.tab_name}
                />
              ),
          )}
        </Tabs>
      </div>
      <TabPanel
        value={value}
        index={0}
      >
        <TaskDetails />
      </TabPanel>
      <TabPanel
        value={value}
        index={1}
      >
        <GanttView />
      </TabPanel>
      <TabPanel
        value={value}
        index={2}
      >
        <DocumentsView lite />
      </TabPanel>
      {tabArrays?.map((tab, index) => (
        // TODO FIXME
        // eslint-disable-next-line react/jsx-key
        <TabPanel
          value={value}
          index={3 + index}
        >
          <Descriptions contentData={tab} />
        </TabPanel>
      ))}
    </>
  );
}

export default React.memo(ContentTab);
