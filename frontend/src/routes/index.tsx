import { lazy } from 'react';

const UserManagement = lazy(() => import('../pages/UserManagement'));
const Calendar = lazy(() => import('../pages/Calendar'));
const Employees = lazy(() => import('../pages/Employees'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Reports = lazy(() => import('../pages/Reports'));
const RequestLeave = lazy(() => import('../pages/RequestLeave'));
const AddUser = lazy(() => import('../pages/AddUser'));


const coreRoutes = [
  {
    path: '/user-management',
    title: 'user-management',
    component: UserManagement,
  },
  {
    path: '/add-user',
    title: 'add-user',
    component: AddUser,
  },
  {
    path: '/calendar',
    title: 'Calender',
    component: Calendar,
  },
  {
    path: '/employees',
    title: 'Employees',
    component: Employees,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  
  {
    path: '/reports',
    title: 'Reports',
    component: Reports,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/request-leave',
    title: 'Request-leave',
    component: RequestLeave,
  },
  {
    path: '/request-leave/:id',
    title: 'Request-leave',
    component: RequestLeave,
  }
];

const routes = [...coreRoutes];
export default routes;
