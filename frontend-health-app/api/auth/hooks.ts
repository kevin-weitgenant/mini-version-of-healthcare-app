import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from './apiClient';
import { getAuthToken } from '../config';
import { useEffect, useState } from 'react';

export const useCurrentUser = () => {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Only check for token on client side after mount
    setHasToken(!!getAuthToken());
  }, []);
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: hasToken, // Only run query if user has a token
    retry: false, // Don't retry on failure
  });
};

