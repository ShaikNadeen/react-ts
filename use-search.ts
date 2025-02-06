import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Update search term from URL on component mount or location change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') ?? '';
    setSearchQuery(search);
  }, [location.search]);

  // Debounced function to update the search term and URL query parameter
  const debouncedSetSearchQuery = useCallback(
    debounce((newSearchQuery: string) => {
      const params = new URLSearchParams(location.search);
      params.set('search', newSearchQuery);
      navigate(`${location.pathname}?${params.toString()}`);
    }, 100),
    [location, navigate]
  );

  const handleSearch = (newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
    debouncedSetSearchQuery(newSearchQuery);
  };

  return {
    searchQuery,
    setSearchQuery: handleSearch,
  };
};
