import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { UserProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext';
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  return (
    <ThemeProvider>
      <UserProvider>
        <SocketProvider>
        <Router />
        </SocketProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
