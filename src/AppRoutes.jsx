import React, { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Maintenance from './pages/Maintenance';
import config from './config';
import JFLayout from './layouts/JFLayout/JFLayout';
import { useUserContext } from './context/UserContext';
import { loader as maapLoader } from './pages/MutualActionPlan/queries';
import { useQueryClient } from '@tanstack/react-query';
import Loader from './components/Loader';
import IntegrationsPage from './pages/Integrations';

const Home = lazy(() => import('./pages/Home/Homepage'));
const Board = lazy(() => import('./pages/Board'));
const Insights = lazy(() => import('./pages/Insights'));
const Legal = lazy(() => import('./pages/Legal/Legal'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const CrmTable = lazy(() => import('./components/Crm/CrmTable'));
const Workload = lazy(() => import('./pages/Workload'));
const InsightsV2 = lazy(() => import('./pages/InsightsV2'));
const BoardWorkload = lazy(() => import('./pages/BoardWorkload'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const MyTasks = lazy(() => import('./pages/MyTasks/MyTasks'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Queues = lazy(() => import('./pages/Queues/Queues'));
const CompanyView = lazy(() => import('./pages/CompanyView'));
const ConfirmationPage = lazy(() => import('./pages/Confirmation-page'));
const InstancePage = lazy(() => import('./pages/InstancePage'));
const SuperUserPage = lazy(() => import('./pages/SuperUserPage'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const CreateProject = lazy(() => import('./pages/CreateProject'));
const CrmProject = lazy(() => import('./pages/CrmProjects'));
const Admin = lazy(() => import('./pages/Adminpage/Adminpage'));
const MutualActionPlan = lazy(() => import('./pages/MutualActionPlan'));

export default function AppRoutes() {
  const queryClient = useQueryClient();
  const { hasToken, hasAdminToken } = useUserContext();
  const environment = config.REACT_APP_ENV;
  const path = new URL(window.location.href);
  const isNavbars = new URLSearchParams(path.search).get('navbars');

  if (environment === 'maintenance') {
    return <Maintenance />;
  }

  // Routes that are only available when a user is not authenticated
  const loggedOutRoutes = [{ path: '/login', element: <Login /> }];

  // Routes availble when the token is an admin token
  const adminRoutes = [
    {
      path: '/admin',
      element: <Admin />,
    },
    {
      path: '/createinstance',
      element: <InstancePage />,
    },
    {
      path: '/superuser',
      element: <SuperUserPage />,
    },
  ];

  // These are the routes that can be accessed by logged-in or non-logged-in users (in that case the search param contains the jwt)
  const defaultRoutes = [
    {
      path: '/mutual-action-plan',
      element: <MutualActionPlan />,
      loader: maapLoader(queryClient),
    },
    {
      path: '/task_review',
      element: <MutualActionPlan />,
      loader: maapLoader(queryClient),
    },
    {
      path: '/company_view',
      element: <CompanyView />,
    },
    {
      path: '/confirmation/:user_created',
      element: <ConfirmationPage />,
    },
    {
      path: '/reset_password',
      element: <ForgotPassword />,
    },
  ];

  // Routes that are only accessible for authenticated users
  const appRoutes = [
    {
      path: '/',
      element: (
        <JFLayout>
          <Home />
        </JFLayout>
      ),
    },
    {
      path: '/integrations',
      element: (
        <JFLayout>
          <IntegrationsPage />
        </JFLayout>
      ),
    },
    {
      path: '/board',
      element:
        isNavbars === 'False' ? (
          <Board />
        ) : (
          <JFLayout fullWidth>
            <Board />
          </JFLayout>
        ),
    },

    {
      path: '/legal',
      element: (
        <JFLayout>
          <Legal />
        </JFLayout>
      ),
    },
    {
      path: '/settings',
      element: (
        <JFLayout tabpanel>
          <Settings />
        </JFLayout>
      ),
    },
    {
      path: '/profile',
      element: (
        <JFLayout tabpanel>
          <Profile />
        </JFLayout>
      ),
    },
    {
      path: '/projects',
      element: (
        <JFLayout>
          <Projects />
        </JFLayout>
      ),
    },
    {
      path: '/crm_deals',
      element: (
        <JFLayout>
          <CrmTable />
        </JFLayout>
      ),
    },
    {
      path: '/create_project',
      element:
        isNavbars === 'False' ? (
          <CreateProject />
        ) : (
          <JFLayout>
            <CreateProject />
          </JFLayout>
        ),
    },
    {
      path: '/crm_project',
      element:
        isNavbars === 'False' ? (
          <CrmProject />
        ) : (
          <JFLayout>
            <CrmProject />
          </JFLayout>
        ),
    },
    {
      path: '/my_tasks',
      element: (
        <JFLayout>
          <MyTasks />
        </JFLayout>
      ),
    },

    {
      path: '/queues',
      element: (
        <JFLayout>
          <Queues />
        </JFLayout>
      ),
    },
    {
      path: '/workload_priorities',
      element: (
        <JFLayout>
          <Workload />
        </JFLayout>
      ),
    },
    {
      path: '/board_priorities',
      element: (
        <JFLayout>
          <BoardWorkload />
        </JFLayout>
      ),
    },
    {
      path: '/support',
      element: (
        <JFLayout>
          <SupportPage />
        </JFLayout>
      ),
    },
    {
      path: '/analytics',
      element: (
        <JFLayout>
          <AnalyticsPage />
        </JFLayout>
      ),
    },
  ];

  const unusedRoutes = [
    {
      path: '/insights',
      element: (
        <JFLayout>
          <Insights />
        </JFLayout>
      ),
    },
    {
      path: '/insights_v2',
      element: (
        <JFLayout>
          <InsightsV2 />
        </JFLayout>
      ),
    },
    {
      path: '/tasks',
      element: (
        <JFLayout>
          <Tasks />
        </JFLayout>
      ),
    },
  ];

  const routes = [...defaultRoutes];

  if (hasToken) {
    routes.push(...appRoutes);
    routes.push(...unusedRoutes);
  }

  if (hasAdminToken) {
    routes.push(...adminRoutes);
  }

  if (!hasToken) {
    routes.push(...loggedOutRoutes);
  }

  // TODO where to add <React.Suspense fallback={<Loader fullscreen />}>
  const router = createBrowserRouter(routes, {
    basename: `${process.env.PR_NUMBER ? '/pr-' + process.env.PR_NUMBER : ''}`,
    
  });
  

  return (
    <React.Suspense fallback={<Loader fullscreen />}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
}
