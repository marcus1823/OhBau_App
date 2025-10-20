import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import {
  addProductToCartApi,
  deleteCartItemApi,
  getCartItemsByAccountApi,
  getCartItemsDetailsApi,
  updateItemQuantityApi
} from '../api/shopApi';
import { useToast } from '../../../utils/toasts/useToast';

/**
 * Hook to get cart items by account
 */
export const useCartItemsByAccount = (pageNumber = 1, pageSize = 100) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return useQuery({
    queryKey: ['cartItemsByAccount', pageNumber, pageSize],
    queryFn: () => getCartItemsByAccountApi(pageNumber, pageSize, accessToken || ''),
    enabled: !!accessToken,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook to get cart items details
 */
export const useCartItemsDetails = (pageNumber = 1, pageSize = 100) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return useQuery({
    queryKey: ['cartItemsDetails', pageNumber, pageSize],
    queryFn: () => getCartItemsDetailsApi(pageNumber, pageSize, accessToken || ''),
    enabled: !!accessToken,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook to add product to cart
 */
export const useAddToCart = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      addProductToCartApi(productId, quantity, accessToken || ''),
    onSuccess: () => {
      // Invalidate cart queries to update cart data
      queryClient.invalidateQueries({ queryKey: ['cartItemsByAccount'] });
      queryClient.invalidateQueries({ queryKey: ['cartItemsDetails'] });
      showSuccess('Sản phẩm đã được thêm vào giỏ hàng');
    },
    onError: (error) => {
      showError(`Lỗi khi thêm vào giỏ hàng: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  });
};

/**
 * Hook to update item quantity in cart
 */
export const useUpdateCartItemQuantity = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateItemQuantityApi(itemId, quantity, accessToken || ''),
    onSuccess: () => {
      // Completely invalidate and refetch cart queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['cartItemsByAccount'] });
      queryClient.invalidateQueries({ queryKey: ['cartItemsDetails'] });
      queryClient.invalidateQueries({ queryKey: ['cartItemsByAccountInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['cartItemsDetailsInfinite'] });

      // Force refetch to update UI immediately
      queryClient.refetchQueries({ queryKey: ['cartItemsByAccountInfinite'] });
      queryClient.refetchQueries({ queryKey: ['cartItemsDetailsInfinite'] });

      showSuccess('Cập nhật số lượng thành công');
    },
    onError: (error) => {
      showError(`Lỗi khi cập nhật số lượng: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  });
};

/**
 * Hook to delete item from cart
 */
export const useDeleteCartItem = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (itemId: string) => deleteCartItemApi(itemId, accessToken || ''),
    onMutate: async (_itemId) => {
      queryClient.invalidateQueries({ queryKey: ['cartItemsByAccount'] });

      await queryClient.cancelQueries({ queryKey: ['cartItemsByAccountInfinite'] });
      await queryClient.cancelQueries({ queryKey: ['cartItemsDetailsInfinite'] });

      // Snapshot the current state for rollback on error
      const previousCartItems = queryClient.getQueryData(['cartItemsByAccountInfinite']);
      queryClient.invalidateQueries({ queryKey: ['cartItemsByAccount'] });
      const previousCartDetails = queryClient.getQueryData(['cartItemsDetailsInfinite']);
      queryClient.invalidateQueries({ queryKey: ['cartItemsByAccount'] });

      return { previousCartItems, previousCartDetails };
    },
    onSuccess: () => {
      // Instead of immediately invalidating and refetching, schedule them with a small delay
      // This gives Redux and React Query time to settle
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['cartItemsByAccount'] });
        queryClient.invalidateQueries({ queryKey: ['cartItemsByAccountInfinite'] });
        queryClient.invalidateQueries({ queryKey: ['cartItemsDetailsInfinite'] });

        // Schedule refetches with a slight delay to prevent UI jank
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['cartItemsByAccount'] });
          queryClient.refetchQueries({ queryKey: ['cartItemsByAccountInfinite'] });
          queryClient.refetchQueries({ queryKey: ['cartItemsDetailsInfinite'] });
        }, 300);

        showSuccess('Xóa sản phẩm thành công');
      }, 100);
    },
    onError: (error, _itemId, context) => {
      // If we have previous data, roll back to it
      if (context?.previousCartItems) {
        queryClient.setQueryData(['cartItemsByAccountInfinite'], context.previousCartItems);
      }
      if (context?.previousCartDetails) {
        queryClient.setQueryData(['cartItemsDetailsInfinite'], context.previousCartDetails);
      }

      showError(`Lỗi khi xóa sản phẩm: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);

      // Try to recover by refetching
      queryClient.refetchQueries({ queryKey: ['cartItemsByAccountInfinite'] });
      queryClient.refetchQueries({ queryKey: ['cartItemsDetailsInfinite'] });
    },
  });
};
