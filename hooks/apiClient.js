import { useSelector } from 'react-redux';

const useApiClient = () => {
  const { token } = useSelector((state) => state.auth);

  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response.json();
  };

  return { fetchWithAuth };
};

export default useApiClient;