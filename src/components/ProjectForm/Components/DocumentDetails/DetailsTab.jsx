import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import Changes from './Tabs/Changes';
import Comments from './Tabs/Comments';
import Negotiations from './Tabs/Negotiations';
import { requestClauseList } from '../../../../Redux/Actions/document-upload';
import { setMessage } from '../../../../Redux/Actions/loader';

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
    borderBottom: '10px grey',
    '& .MuiTabs-flexContainer': {
      flexWrap: 'wrap',
      alignItems: 'center',
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
    fontWeight: 'bolder',
    fontSize: 16,
    marginRight: theme.spacing(0),
    height: 60,
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
      fontWeight: 'bolder',
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

function DetailsTab({ selectedTab }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(selectedTab);
  const doc_data = useSelector((state) => state.storedData);
  const doc_properties = doc_data?.data?.document_properties;
  const changes_count =
    doc_properties?.inserted_text?.length + doc_properties?.deleted_text?.length;
  const comments_count = doc_data?.data?.extracted_comments?.length;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 2) {
      dispatch(setMessage('Loading...'));
      dispatch(requestClauseList({ doc_id: doc_data?.data?.id, hidden: false }));
    }
  };

  useEffect(() => {
    setValue(selectedTab);
  }, [selectedTab]);

  return (
    <div
      style={{ padding: `0 1.5rem 1.5rem 1.5rem` }}
      className={`${classes.root} tabHeaderWrap`}
    >
      <AppBar
        position="static"
        elevation={0}
        color="default"
      >
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="full width tabs example"
        >
          <StyledTab
            label={
              <div>
                <strong className="font-bold-18 tracked-changes">
                  {!isNaN(changes_count) ? changes_count : ''} Tracked Changes
                </strong>
              </div>
            }
          />
          <StyledTab
            label={
              <div>
                <strong className="font-bold-18 doc-comments">
                  {!isNaN(comments_count) ? comments_count : ''} Comments
                </strong>
              </div>
            }
          />
          <StyledTab
            label={
              <div>
                <strong className="font-bold-18 doc-clauses">
                  {!isNaN(doc_data?.data?.clauses_counts?.clause_count)
                    ? doc_data?.data?.clauses_counts?.clause_count
                    : ''}{' '}
                  Clauses
                </strong>
              </div>
            }
          />
        </StyledTabs>
      </AppBar>
      <TabPanel
        className="tab-panel tabPanelWrap"
        value={value}
        index={0}
      >
        <Changes />
      </TabPanel>
      <TabPanel
        className="tabPanelWrap"
        value={value}
        index={1}
      >
        <Comments />
      </TabPanel>
      <TabPanel
        className="tabPanelWrap"
        value={value}
        index={2}
      >
        <Negotiations />
      </TabPanel>
    </div>
  );
}

export default React.memo(DetailsTab);
