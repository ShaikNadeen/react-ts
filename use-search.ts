import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Utility function to debounce any given function.
 * The debounced function will only be invoked after `delay` milliseconds have passed since the last invocation.
 */
function debounce(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Custom hook to manage search query parameter with debouncing.
 * @returns { searchQuery: string, setSearchQuery: (term: string) => void }
 */
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