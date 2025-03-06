import fetchWrapper from '@/services/fetchwrapper';
import { useQuery } from '@tanstack/react-query';

import { useState, useEffect } from "react";

export const useSearch = (search: string) => {

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); 

    return () => clearTimeout(timeoutId); 
  }, [search]);

  return useQuery({
    queryKey: ['search-data', debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch) {
        const url = `/api/products/?name_like=${debouncedSearch}`;
        return fetchWrapper<any[]>(url, {
          method: 'GET',
        });
      }
      return [];
    },
    enabled: !!debouncedSearch,  
  });
};
