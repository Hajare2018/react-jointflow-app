import { InsightsOutlined } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '../../component-lib/catalyst/sidebar';
import { Avatar } from '../../component-lib/catalyst/avatar';
import Jointflows from '../../component-lib/icons/jointflows';
import BugIcon from '../../component-lib/icons/BugIcon';
import ProjectsIcon from '../../component-lib/icons/ProjectsIcon';
import HomeIcon from '../../component-lib/icons/HomeIcon';
import FeatureIcon from '../../component-lib/icons/FeatureIcon';
import HelpIcon from '../../component-lib/icons/HelpIcon';
import LegalIcon from '../../component-lib/icons/LegalIcon';
import LogoutIcon from '../../component-lib/icons/LogoutIcon';
import PrioritisationIcon from '../../component-lib/icons/PrioritisationIcon';
import QueuesIcon from '../../component-lib/icons/QueuesIcon';
import SettingsIcon from '../../component-lib/icons/SettingsIcon';
import TasksIcon from '../../component-lib/icons/TasksIcon';
import checkPermission from './check-permission';
import { useTenantContext } from '../../context/TenantContext';
import NotificationPopover from '../../components/NotificationPopover';

const mainLinks = [
  {
    href: '/',
    label: 'Home',
    icon: HomeIcon,
  },
  {
    href: '/projects',
    label: 'Projects',
    checkPermission: checkPermission('view_projects_menu'),
    icon: ProjectsIcon,
  },
  {
    href: '/legal',
    label: 'Legal',
    checkPermission: checkPermission('view_legal_menu'),
    icon: LegalIcon,
  },
  {
    href: '/my_tasks',
    label: 'My Tasks',
    checkPermission: checkPermission('view_my_tasks_menu'),
    icon: TasksIcon,
  },
  {
    href: '/queues',
    label: 'Queues',
    checkPermission: checkPermission('view_queues_menu'),
    icon: QueuesIcon,
  },
  {
    href: '/board_priorities',
    label: 'Prioritisation',
    checkPermission: checkPermission('view_sales_prioritisation_menu'),
    icon: PrioritisationIcon,
  },
  {
    href: '/analytics',
    label: 'Analytics',
    checkPermission: checkPermission('view_analytics_menu'),
    icon: InsightsOutlined,
  },
];

const helpLinks = [
  {
    href: 'https://jointflows.ladesk.com/',
    target: '_blank',
    label: 'Help',
    icon: HelpIcon,
  },
  {
    href: 'https://jointflows.canny.io/feature-requests',
    target: '_blank',
    label: 'Suggest Feature',
    icon: FeatureIcon,
  },
  {
    href: 'https://jointflows.ladesk.com/submit_ticket',
    target: '_blank',
    label: 'Report a Bug',
    icon: BugIcon,
  },
];

export default function JFSidebar({ user, permissions, logoutUser }) {
  const location = useLocation();
  const { activate_notifications } = useTenantContext();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarSection>
          <div className="mb-2 flex h-20 flex items-center">
            <SidebarItem to="/">
              <Jointflows
                width={170}
                height={40}
              />
            </SidebarItem>
          </div>
        </SidebarSection>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          {activate_notifications && <NotificationPopover />}
          {mainLinks
            .filter((link) => (link.checkPermission ? link.checkPermission(permissions) : true))
            .map((link) => {
              return (
                <SidebarItem
                  key={link.label}
                  to={link.href}
                  current={location.pathname === link.href}
                >
                  {link.icon && (
                    <link.icon
                      width={20}
                      height={20}
                    />
                  )}
                  <SidebarLabel>{link.label}</SidebarLabel>
                </SidebarItem>
              );
            })}
          <SidebarDivider />
          {helpLinks.map((link) => (
            <SidebarItem
              key={link.label}
              to={link.href}
              target="_blank"
            >
              {link.icon && (
                <link.icon
                  width={20}
                  height={20}
                />
              )}
              <SidebarLabel>{link.label}</SidebarLabel>
            </SidebarItem>
          ))}
        </SidebarSection>
        <SidebarSpacer />
        <SidebarSection>
          <SidebarItem onClick={logoutUser}>
            <LogoutIcon
              width={20}
              height={20}
            />
            <SidebarLabel>Logout</SidebarLabel>
          </SidebarItem>
          {checkPermission('view_settings_menu')(permissions) && (
            <SidebarItem
              to="/settings"
              current={location.pathname === '/settings'}
            >
              <SettingsIcon
                width={20}
                height={20}
              />
              <SidebarLabel>Settings</SidebarLabel>
            </SidebarItem>
          )}
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <SidebarSection>
          <SidebarItem
            to="/profile"
            current={location.pathname === '/profile'}
          >
            <Avatar
              className="size-6"
              src={user.avatar}
              initials={user.avatar ? '' : `${user.first_name[0]}${user.last_name[0]}`}
            />
            <SidebarLabel>
              {user.first_name} {user.last_name}
            </SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  );
}
