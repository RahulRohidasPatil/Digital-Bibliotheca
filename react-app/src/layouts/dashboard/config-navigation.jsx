import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  // {
  //   title: 'user',
  //   path: '/user',
  //   icon: icon('ic_user'),
  // },

  {
    title: 'Upload Content',
    path: '/upload-content',
    icon: <Iconify icon="eva:person-outline" />,
  },
  {
    title: 'Search',
    path: '/search',
    icon: <Iconify icon="eva:search-fill" />,
  },
  {
    title: 'My Uploads',
    path: '/my-uploads',
    icon: <Iconify icon="eva:arrow-upward-fill" />,
  },
  {
    title: 'My Media',
    path: '/my-media',
    icon: <Iconify icon="eva:arrow-downward-fill" />,
  },
  {
    title: 'Chats',
    path: '/chats',
    icon: <Iconify icon="mdi:chat-outline" />,
  },
  {
    title: 'User Management',
    path: '/user-management',
    icon: <Iconify icon="ri:admin-line" />,
    isAdminPath: true
  }
];

export default navConfig;
