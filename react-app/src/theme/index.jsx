import { createContext, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

import { palette } from './palette';
import { shadows } from './shadows';
import { overrides } from './overrides';
import { typography } from './typography';
import { customShadows } from './custom-shadows';

// ----------------------------------------------------------------------

export const themeContext = createContext(null);

export default function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(localStorage.getItem('theme'));

  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  const memoizedValue = useMemo(
    () => ({
      switchThemeMode: toggleThemeMode,
      theme: createTheme({
        palette: palette(themeMode),
        typography,
        shadows: shadows(),
        customShadows: customShadows(),
        shape: { borderRadius: 8 },
        mode: themeMode,
      }),
    }),
    [themeMode]
  );

  useEffect(()=>{
    localStorage.setItem('theme', themeMode)
  }, [themeMode])

  memoizedValue.theme.components = overrides(memoizedValue.theme);

  return (
    <themeContext.Provider value={memoizedValue}>
      <MUIThemeProvider theme={memoizedValue.theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </themeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};