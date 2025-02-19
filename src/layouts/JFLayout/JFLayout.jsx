import { SidebarLayout } from '../../component-lib/catalyst/sidebar-layout';
import { useUserContext } from '../../context/UserContext';
import JFNavbar from './JFNavbar';
import JFSidebar from './JFSidebar';

export default function JFLayout({ children, tabpanel }) {
  const { user, permissions, logoutUser } = useUserContext();

  return (
    <SidebarLayout
      navbar={
        <JFNavbar
          user={user}
          permissions={permissions?.group}
          logoutUser={() => logoutUser()}
        />
      }
      sidebar={
        <JFSidebar
          user={user}
          permissions={permissions?.group}
          logoutUser={() => logoutUser()}
        />
      }
      fullWidth
      tabpanel={tabpanel}
    >
      {children}
    </SidebarLayout>
  );
}
