import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext({
  user: '',
  setUser: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user');
      if (saved) {
        const initialValue = JSON.parse(saved);
        console.log(initialValue);
        return initialValue;
      }
    }

    return null;
  });
  const values = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
UserProvider.propTypes = {
  children: PropTypes.node,
};
export { UserContext, UserProvider };
