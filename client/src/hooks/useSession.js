import { useState, useEffect } from 'react';
import { getSessionStatus } from '../utils/sessionUtils';

export const useSession = () => {
  const [sessionInfo, setSessionInfo] = useState(getSessionStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionInfo(getSessionStatus());
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return sessionInfo;
};
