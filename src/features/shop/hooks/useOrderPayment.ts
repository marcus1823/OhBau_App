import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { createOrderApi, createPaymentApi, getPaymentReturnApi } from '../api/shopApi';
import { useToast } from '../../../utils/toasts/useToast';

/**
 * Hook to create an order from selected cart items
 */
export const useCreateOrder = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { showError } = useToast();
  
  console.log('[HOOK] useCreateOrder - Initialized, access token exists:', !!accessToken);

  return useMutation({
    mutationFn: (itemIds: string[]) => {
      console.log('[HOOK] useCreateOrder - Executing mutation with itemIds:', itemIds);
      return createOrderApi(itemIds, accessToken || '');
    },
    onMutate: (itemIds) => {
      console.log('[HOOK] useCreateOrder - Starting mutation with itemIds:', itemIds);
    },
    onSuccess: (data) => {
      console.log('[HOOK] useCreateOrder - Success:', JSON.stringify(data));
    },
    onError: (error) => {
      console.error('[HOOK] useCreateOrder - Error:', error);
      showError(`Lỗi khi tạo đơn hàng: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    },
    onSettled: () => {
      console.log('[HOOK] useCreateOrder - Mutation settled');
    }
  });
};

/**
 * Hook to create payment for an order
 * Returns a payment URL to be used with WebView
 */
export const useCreatePayment = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { showError } = useToast();
  
  console.log('[HOOK] useCreatePayment - Initialized, access token exists:', !!accessToken);

  return useMutation({
    mutationFn: ({ orderCode, description }: { orderCode: string, description: string }) => {
      console.log('[HOOK] useCreatePayment - Executing mutation with orderCode:', orderCode);
      return createPaymentApi(orderCode, description, accessToken || '');
    },
    onMutate: (variables) => {
      console.log('[HOOK] useCreatePayment - Starting mutation with orderCode:', variables.orderCode);
    },
    onSuccess: (data) => {
      console.log('[HOOK] useCreatePayment - Success, payment URL created:', data?.url);
    },
    onError: (error) => {
      console.error('[HOOK] useCreatePayment - Error:', error);
      showError(`Lỗi khi tạo thanh toán: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    },
    onSettled: () => {
      console.log('[HOOK] useCreatePayment - Mutation settled');
    }
  });
};

/**
 * Hook to process payment return from VNPAY
 */
export const useProcessPaymentReturn = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { showError } = useToast();
  
  console.log('[HOOK] useProcessPaymentReturn - Initialized, access token exists:', !!accessToken);

  return useMutation({
    mutationFn: (queryString: string) => {
      console.log('[HOOK] useProcessPaymentReturn - Executing mutation with queryString:', queryString);
      return getPaymentReturnApi(queryString, accessToken || '');
    },
    onMutate: (queryString) => {
      console.log('[HOOK] useProcessPaymentReturn - Starting mutation with queryString:', queryString);
    },
    onSuccess: (data) => {
      console.log('[HOOK] useProcessPaymentReturn - Success:', JSON.stringify(data));
    },
    onError: (error) => {
      console.error('[HOOK] useProcessPaymentReturn - Error:', error);
      showError(`Lỗi khi xử lý kết quả thanh toán: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    },
    onSettled: () => {
      console.log('[HOOK] useProcessPaymentReturn - Mutation settled');
    }
  });
};
