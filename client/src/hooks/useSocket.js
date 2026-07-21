import { useEffect, useRef } from 'react';
import { getSocket } from '../api/socket';

export function useSocket(eventHandlers = {}) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    socketRef.current = socket;

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = (event, data, callback) => {
    socketRef.current?.emit(event, data, callback);
  };

  return { emit, socket: socketRef };
}
