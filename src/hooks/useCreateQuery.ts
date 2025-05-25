import { useQuery, UseQueryOptions, QueryFunctionContext } from '@tanstack/react-query';
import { useToast } from '../utils/toasts/useToast';

/**
 * Custom hook để tạo query (API GET) với toast tích hợp
 *
 * @template TQueryFnData - Kiểu dữ liệu trả về từ queryFn (response từ API)
 * @template TError - Kiểu lỗi (default: Error)
 * @template TData - Kiểu dữ liệu sau khi select (default: TQueryFnData)
 * @template TQueryKey - Kiểu của queryKey (mảng khóa, default: readonly unknown[])
 *
 * @param queryKey - Mảng khóa duy nhất cho query (dùng để cache và xác định query)
 * @param queryFn - Hàm thực hiện query (API gọi bằng axios/fetch, trả Promise<TQueryFnData>)
 * @param successMessage - Thông báo khi query thành công (tùy chọn, dùng trong toast)
 * @param errorMessage - Thông báo khi query thất bại (tùy chọn, dùng trong toast)
 * @param options - Các tùy chọn thêm của useQuery
 *
 * @returns Kết quả query với data, isLoading, isError, error, isSuccess, v.v.
 */
export const useCreateQuery = <
  TQueryFnData,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[]
>(
  queryKey: TQueryKey,
  queryFn: (context: QueryFunctionContext<TQueryKey>) => Promise<TQueryFnData>,
  successMessage?: string,
  errorMessage?: string,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
) => {
  const { showError, showSuccess } = useToast();

  // Wrapper để xử lý toast và log
  const wrappedQueryFn = async (context: QueryFunctionContext<TQueryKey>): Promise<TQueryFnData> => {
    try {
      const data = await queryFn(context);
      if (successMessage) {
        showSuccess(successMessage);
      }
      return data; // Đảm bảo luôn trả về giá trị
    } catch (error) {
      console.error(`${queryKey.join('-')} error - Details:`, {
        message: error instanceof Error ? error.message : 'Unknown error',
        response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
        status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
      });
      if (errorMessage) {
        showError(error instanceof Error ? error.message : errorMessage);
      }
      throw error; // Ném lại lỗi để TanStack Query xử lý
    }
  };

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey,
    queryFn: wrappedQueryFn,
    ...options,
  });
};