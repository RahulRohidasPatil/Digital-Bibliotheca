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
];

export default navConfig;
