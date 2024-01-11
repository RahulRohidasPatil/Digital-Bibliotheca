import {  io } from "socket.io-client";
import { createContext, useState, useMemo } from "react";
import PropTypes from 'prop-types';

const SocketContext = createContext({
    socket: '',
    setSocket: () => {},
  });
  
   
  const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(() => {
      if (typeof window !== 'undefined') {
        return io(':4000');
      }
  
      return null;
    });
    const values = useMemo(
      () => ({
        socket,
        setSocket,
      }),
      [socket]
    );
    return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
  };
  SocketProvider.propTypes = {
    children: PropTypes.node,
  };
  export { SocketContext, SocketProvider };