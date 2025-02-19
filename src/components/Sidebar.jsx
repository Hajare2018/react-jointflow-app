import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItemText, ListItemButton } from '@mui/material';
import Hidden from '@mui/material/Hidden';
import useStyles from './styles';
import clsx from 'clsx';
import { isActive } from './Utils';
import upDownArrow from '../assets/icons/UpDownDarkGrey20.png';
import upDownArrowActive from '../assets/icons/UpDownWhite18.png';
import queueActive from '../assets/icons/Queue_icon_white64.png';
import queueIcon from '../assets/icons/Queue_icon_black64.png';
import {
  AssessmentOutlined,
  ContactSupportOutlined,
  DescriptionOutlined,
  Equalizer,
  HomeOutlined,
  ImportExportOutlined,
} from '@mui/icons-material';
import { FaTasks } from 'react-icons/fa';
import { useUserContext } from '../context/UserContext';

function DrawerList() {
  const { pathname } = window.location;
  const isSamePath = (path) => {
    if (pathname === path) {
      return true;
    }
  };
  const { permissions } = useUserContext();
  const allPermissions = permissions?.group?.map((access) => access.permission);
  const viewProjects = allPermissions?.filter(
    (access) => access?.codename === 'view_projects_menu',
  );
  const viewLegals = allPermissions?.filter((access) => access?.codename === 'view_legal_menu');
  // const viewInsights = allPermissions?.filter(
  //   (access) => access?.codename === "view_insights_menu"
  // );
  const viewMyTasks = allPermissions?.filter((access) => access?.codename === 'view_my_tasks_menu');
  const viewSalesPrioritisation = allPermissions?.filter(
    (access) => access?.codename === 'view_sales_prioritisation_menu',
  );
  const viewQueues = allPermissions?.filter((access) => access?.codename === 'view_queues_menu');
  const viewTasksPrioritisation = allPermissions?.filter(
    (access) => access?.codename === 'view_tasks_prioritisation_menu',
  );
  const viewSupportMenu = allPermissions?.filter(
    (access) => access?.codename === 'view_support_menu',
  );
  const viewAnalyticsMenu = allPermissions?.filter(
    (access) => access?.codename === 'view_analytics_menu',
  );
  return (
    <List
      className="tour-menu"
      disablePadding
    >
      <Link
        to="/"
        className={clsx('side-nav__link', isActive('/'))}
      >
        <ListItemButton className={'side-nav__item'}>
          <HomeOutlined />
          <ListItemText primary={'Home'} />
        </ListItemButton>
      </Link>
      {viewProjects?.length > 0 ? (
        <Link
          to="/projects"
          className={clsx('side-nav__link', isActive('/projects'))}
        >
          <ListItemButton className={'side-nav__item'}>
            <Equalizer style={{ width: 20, height: 20, transform: 'rotate(90deg)' }} />
            <ListItemText primary={'Projects'} />
          </ListItemButton>
        </Link>
      ) : (
        ''
      )}
      {viewLegals?.length > 0 ? (
        <Link
          to="/legal"
          className={clsx('side-nav__link', isActive('/legal'))}
        >
          <ListItemButton className={'side-nav__item'}>
            <DescriptionOutlined />
            <ListItemText primary={'Legal'} />
          </ListItemButton>
        </Link>
      ) : (
        ''
      )}
      {viewMyTasks?.length > 0 ? (
        <Link
          to="/my_tasks"
          className={clsx('side-nav__link', isActive('/my_tasks'))}
        >
          <ListItemButton className={'side-nav__item'}>
            <FaTasks style={{ width: 20, height: 20 }} />
            <ListItemText primary={'My Tasks'} />
          </ListItemButton>
        </Link>
      ) : (
        ''
      )}
      {viewQueues?.length > 0 ? (
        <Link
          to="/queues"
          className={clsx('side-nav__link', isActive('/queues'))}
        >
          <ListItemButton className={'side-nav__item'}>
            <img
              src={isSamePath('/queues') ? queueActive : queueIcon}
              style={{ width: 20, height: 20 }}
            />
            <ListItemText primary={'Queues'} />
          </ListItemButton>
        </Link>
      ) : (
        ''
      )}
      {viewTasksPrioritisation?.length > 0 ? (
        <Link
          to="/workload_priorities"
          className={clsx('side-nav__link', isActive('/workload_priorities'))}
        >
          <ListItemButton className={'side-nav__item'}>
            <img
              src={isSamePath('/workload_priorities') ? upDownArrowActive : upDownArrow}
              style={{ width: 20, height: 20 }}
            />
            <ListItemText primary={'Workload Prioritisation'} />
          </ListItemButton>
        </Link>
      ) : (
        ''
      )}
      {viewSalesPrioritisation?.length > 0 ? (
        <Link
          to="/board_priorities"
          className={clsx('side-nav__link', isActive('/board_priorities'))}
        >
          <ListItemButton className={'side-nav__item list-padding'}>
            <ImportExportOutlined style={{ width: 25, height: 25 }} />
            <ListItemText primary={'Prioritisation'} />
          </ListItemButton>
        </Link>
      ) : (
        ''
      )}
      {viewSupportMenu?.length > 0 && (
        <Link
          to="/support"
          className={clsx('side-nav__link', isActive('/support'))}
        >
          <ListItemButton className={'side-nav__item'}>
            <ContactSupportOutlined style={{ width: 25, height: 25 }} />
            <ListItemText primary={'Support'} />
          </ListItemButton>
        </Link>
      )}
      {viewAnalyticsMenu?.length > 0 && (
        <Link
          to="/analytics"
          className={clsx('side-nav__link', isActive('/analytics'))}
        >
          <ListItemButton className={'side-nav__item'}>
            <AssessmentOutlined style={{ width: 25, height: 25 }} />
            <ListItemText primary={'Analytics'} />
          </ListItemButton>
        </Link>
      )}
    </List>
  );
}

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const classes = useStyles();
  return (
    <div>
      <Hidden
        smUp
        implementation="css"
      >
        <Drawer
          variant="temporary"
          anchor={'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <DrawerList />
        </Drawer>
      </Hidden>
      <Hidden
        xsDown
        implementation="css"
      >
        <nav
          className={classes.drawer}
          aria-label="mailbox folders"
        >
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <DrawerList />
          </Drawer>
        </nav>
      </Hidden>
    </div>
  );
}

export default React.memo(Sidebar);
