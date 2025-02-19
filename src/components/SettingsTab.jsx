import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {
  ContactMail,
  Description,
  LibraryBooks,
  People,
  TableChart,
  TuneOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaRegEdit } from 'react-icons/fa';
import { requestContentsList } from '../Redux/Actions/dashboard-data';
import { useUserContext } from '../context/UserContext';

import TaskTypeTable from './DocumentsType/TaskTypeTable';
import DocumentLibrary from './Documents/DocumentsLibrary/DocumentLibrary';
import TemplatesLibrary from './Documents/TemplatesLibrary/TemplatesLibrary';
import CompaniesTable from './Companies/CompaniesTable';
import UsersTab from './Users/index';
import AdvancedTab from './AdvancedTab/index';
import ContentsTemplate from './Contents/ContentTemplates';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{ height: '100%', padding: '0 16px' }}
      id={`full-width-tabpanel-${index}`}
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

const useStyles = makeStyles(() => ({
  root: {
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
      maxWidth: 180,
      width: '100%',
      backgroundColor: '#ef3d48',
      color: '#ef3d48',
      borderBottomColor: '#ef3d48',
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
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center',
    '&:hover': {
      color: '#ef3d48',
      opacity: 2,
    },
    '&.Mui-selected': {
      outline: 'none',
      color: '#ef3d48',
    },
    '&:selected': {
      color: '#ef3d48',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#ef3d48',
      outline: 'none',
    },
    borderBottom: '1px solid #ccc;',
  },
}))((props) => (
  <Tab
    disableRipple
    {...props}
  />
));

function SettingsTab({ view, tab, displayToggle }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const url = new URLSearchParams(window.location.search);
  const { permissions } = useUserContext();
  const allPermissions = permissions?.group?.map((access) => access.permission);
  const viewCompanyTab = allPermissions?.filter(
    (access) => access?.codename === 'manage_company_contacts',
  );
  const viewDoctypeTab = allPermissions?.filter(
    (access) => access?.codename === 'manage_task_types',
  );
  const viewUsersTab = allPermissions?.filter((access) => access?.codename === 'manage_users');
  const viewDocumentsLibraryTab = allPermissions?.filter(
    (access) => access?.codename === 'manage_document_library',
  );
  const viewProjectsLibraryTab = allPermissions?.filter(
    (access) => access?.codename === 'manage_board_templates',
  );
  const viewAdvancedTab = allPermissions?.filter(
    (access) => access?.codename === 'view_advanced_settings_tab',
  );

  const tabs = [
    {
      id: 0,
      name: 'Flows',
      tab: 'flows',
      icon: <Description width={24} />,
      show: viewDoctypeTab?.length > 0,
      component: <TaskTypeTable />,
    },
    {
      id: 6,
      name: 'Content Library',
      tab: 'contents',
      icon: <FaRegEdit />,
      show: true,
      component: <ContentsTemplate />,
    },
    {
      id: 1,
      name: 'Playbooks',
      tab: 'play_books',
      icon: <TableChart />,
      show: viewProjectsLibraryTab?.length > 0,
      component: <TemplatesLibrary />,
    },
    {
      id: 2,
      name: 'Document Library',
      tab: 'document_library',
      icon: <LibraryBooks />,
      show: viewDocumentsLibraryTab?.length > 0,
      component: <DocumentLibrary />,
    },
    {
      id: 3,
      name: 'Users & Access',
      tab: 'users',
      icon: <People />,
      show: viewUsersTab?.length > 0,
      component: <UsersTab view={view} />,
    },
    {
      id: 4,
      name: 'Companies & Contacts',
      tab: 'companies',
      icon: <ContactMail />,
      show: viewCompanyTab?.length > 0,
      component: <CompaniesTable view={view} />,
    },
    {
      id: 5,
      name: 'Advanced',
      tab: 'advanced',
      icon: <TuneOutlined />,
      show: viewAdvancedTab?.length > 0,
      component: <AdvancedTab view={view} />,
    },
  ];
  const filteredTabs = tabs?.filter((tab) => tab.show === true);

  const handletabId = (index, newValue) => {
    setValue(index);
    if (newValue === 0) {
      url.set('tab', 'flows');
      tab(newValue);
    }
    if (newValue === 1) {
      url.set('tab', 'play_books');
      tab(newValue);
    }
    if (newValue === 2) {
      url.set('tab', 'document_library');
      tab(newValue);
    }
    if (newValue === 3) {
      url.set('tab', 'users');
      tab(newValue);
    }
    if (newValue === 4) {
      url.set('tab', 'companies');
      tab(newValue);
    }
    if (newValue === 5) {
      url.set('tab', 'advanced');
      tab(newValue);
    }
    if (newValue === 6) {
      dispatch(requestContentsList({ id: null, fetchContent: false }));
      url.set('tab', 'contents');
      tab(newValue);
    }
    tab(newValue);
    navigate(window.location.pathname + '?' + url.toString());
  };

  useEffect(() => {
    if (!window.location.href.includes('?')) {
      window.location = window.location + '?tab=flows';
      setValue(0);
      tab(0);
    } else {
      const getTabFromUrl = url.get('tab');
      const filteredTab = filteredTabs?.filter((item) => item.tab === getTabFromUrl);
      setValue(filteredTabs.indexOf(filteredTab[0]));
      tab(filteredTab?.[0]?.id);
      if (filteredTab?.[0]?.id == 6) {
        dispatch(requestContentsList({ id: null, fetchContent: false }));
      }
    }
  }, []);

  return (
    <div className={classes.root}>
      <AppBar
        position="sticky"
        color="default"
        style={{
          boxShadow: 'none',
          marginBottom: 32,
          background: 'transparent',
        }}
      >
        <StyledTabs
          value={value}
          className="tabWrapper"
        >
          {filteredTabs?.map((tab, index) => (
            <StyledTab
              key={tab.id}
              label={
                <div
                  className={`tab tab${index}`}
                  onClick={() => handletabId(index, tab.id)}
                >
                  {tab.icon} <span>{tab.name}</span>
                </div>
              }
            />
          ))}
        </StyledTabs>
      </AppBar>
      {displayToggle}
      {filteredTabs?.map((tab, index) => (
        <TabPanel
          key={tab.id}
          className="tab-panel"
          value={value}
          index={index}
        >
          {tab.component}
        </TabPanel>
      ))}
    </div>
  );
}

export default React.memo(SettingsTab);
