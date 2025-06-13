import { useInfiniteQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { getCartItemsByAccountApi, getCartItemsDetailsApi } from '../api/shopApi';

/**
 * Hook to get cart items by account with infinite scrolling
 * @param pageSize Number of items per page
 */
export const useInfiniteCartItemsByAccount = (pageSize = 10) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return useInfiniteQuery({
    queryKey: ['cartItemsByAccountInfinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getCartItemsByAccountApi(pageParam as number, pageSize, accessToken || '');
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data) {return undefined;}
      const { page, totalPages } = lastPage.data;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!accessToken,
    staleTime: 5 * 1000, // 5 seconds to ensure frequent refreshing
    refetchOnWindowFocus: true, // Refresh when window is focused
  });
};

/**
 * Hook to get cart items details with infinite scrolling
 * @param pageSize Number of items per page
 */
export const useInfiniteCartItemsDetails = (pageSize = 10) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return useInfiniteQuery({
    queryKey: ['cartItemsDetailsInfinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getCartItemsDetailsApi(pageParam as number, pageSize, accessToken || '');
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data) {return undefined;}
      const { page, totalPages } = lastPage.data;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!accessToken,
    staleTime: 5 * 1000, // 5 seconds to ensure frequent refreshing
    refetchOnWindowFocus: true, // Refresh when window is focused
  });
};

/**
 * Helper hook to extract flattened cart items from infinite query result
 * @param infiniteQueryResult Result from useInfiniteCartItemsByAccount
 */
export const useExtractCartItems = (infiniteQueryResult: any) => {
  const pages = infiniteQueryResult?.data?.pages || [];
  
  // Extract all cart items from all pages
  const cartItems = pages.flatMap((page: any) => {
    if (!page.data || !page.data.items) {return [];}
    return page.data.items;
  });

  return cartItems;
};

/**
 * Helper hook to extract flattened cart items details from infinite query result
 * @param infiniteQueryResult Result from useInfiniteCartItemsDetails
 */
export const useExtractCartItemsDetails = (infiniteQueryResult: any) => {
  const pages = infiniteQueryResult?.data?.pages || [];
  
  // Extract all cart items details from all pages
  const cartItemsDetails = pages.flatMap((page: any) => {
    if (!page.data || !page.data.items) {return [];}
    return page.data.items;
  });

  return cartItemsDetails;
};
