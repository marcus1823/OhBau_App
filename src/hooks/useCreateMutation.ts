import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useToast } from '../utils/toasts/useToast';         
import { useLoading } from '../utils/loading/useLoading';     

// --------------------------------------------------------
// Custom hook: Tạo mutation (API POST/PUT/DELETE) có toast và loading
// --------------------------------------------------------

/**
 * @template T - Kiểu dữ liệu trả về khi mutation thành công (response)
 * @template E - Kiểu lỗi (default: Error)
 * @template V - Kiểu dữ liệu đầu vào cho mutation (request body hoặc params)
 *
 * @param mutationFn - Hàm thực hiện mutation (API gọi bằng axios/fetch, trả Promise<T>)
 * @param context - Tên ngữ cảnh loading (dùng để hiển thị loading theo context cụ thể)
 * @param successMessage - Thông báo khi mutation thành công (dùng trong toast)
 * @param errorMessage - Thông báo fallback khi mutation thất bại
 * @param options - Các tuỳ chọn thêm của useMutation (trừ mutationFn)
 */
export const useCreateMutation = <T, E = Error, V = void>(
  mutationFn: (variables: V) => Promise<T>,
  context: string,
  successMessage: string,
  errorMessage: string,
  options?: Omit<UseMutationOptions<T, E, V>, 'mutationFn'> // Omit là để loại bỏ thuộc tính mutationFn khỏi options
) => {
  const { showError, showSuccess } = useToast();                      // Hook hiển thị toast
  const { showContextLoading, hideContextLoading } = useLoading();   // Hook xử lý loading theo context

  return useMutation<T, E, V>({
    mutationFn,                  // Hàm gọi API
    ...options,                  // Gộp thêm các options từ caller

    // Khi mutation bắt đầu → hiển thị loading
    onMutate: () => showContextLoading(context),

    // Khi mutation thành công → log dữ liệu, hiển thị toast success
    onSuccess: (data) => {
      console.log(`${context} response:`, data);
      showSuccess(successMessage);
    },

    // Khi mutation thất bại → log chi tiết lỗi, hiển thị toast error
    onError: (error: any) => {
      console.error(`${context} error - Details:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      showError(error.message || errorMessage);
    },

    // Khi mutation kết thúc (dù thành công hay lỗi) → tắt loading
    onSettled: () => hideContextLoading(context),
  });
};
