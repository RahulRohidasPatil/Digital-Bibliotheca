import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import MessagesPage from 'src/pages/Messages';
import ChatListPage from 'src/pages/chat-list';
import MyMediaPage from 'src/pages/my-media';
import AdminApprovalDashboard from 'src/pages/admin-approval-dashboard';
import ManageUsersPage from 'src/pages/manage-users';
import EditUploadContent from 'src/pages/edit-media';
import EditProfile from 'src/pages/edit-profile';
import ReportedMediaPage from 'src/pages/reported-media';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UploadContentPage = lazy(() => import('src/pages/upload-content'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ProductInfoPage = lazy(() => import('src/pages/product-info-page'));
export const MyUploadsPage = lazy(() => import('src/pages/my-uploads'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'search', element: <ProductsPage /> },
        { path: 'upload-content', element: <UploadContentPage /> },
        { path: 'product/:id', element: <ProductInfoPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'my-uploads', element: <MyUploadsPage /> },
        { path: 'chats', element: <ChatListPage /> },
        { path: 'edit-profile', element: <EditProfile /> },
        { path: 'chats/:userId', element: <MessagesPage /> },
        { path: 'my-media', element: <MyMediaPage /> },
        { path: 'admin-approval-dashboard', element: <AdminApprovalDashboard /> },
        { path: 'user-management', element: <ManageUsersPage /> },
        { path: 'reported-media', element: <ReportedMediaPage /> },
        { path: 'product/edit/:id', element: <EditUploadContent /> },
        { path: 'discussion/:mediaId', element: <MessagesPage isDiscussion /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
