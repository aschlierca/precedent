import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import client from '../api/client';

// Returns a `request(config)` function that attaches a fresh Auth0 access token
// to every call. Mirrors axios's request-config shape: request({ method, url, data }).
export default function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  const request = useCallback(
    async (config) => {
      const token = await getAccessTokenSilently();
      const response = await client.request({
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    [getAccessTokenSilently]
  );

  return request;
}
