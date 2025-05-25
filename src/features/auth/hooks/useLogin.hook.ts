// import { useMutation } from '@tanstack/react-query';
// import { AuthenticationRequest, AuthenticationResponse } from '../types/auth.types';
// import { loginApi } from '../api/auth';
// import { useToast } from '../../../utils/toasts/useToast';

// export const useLogin = () => {
//     const { showError } = useToast();

//     return useMutation<AuthenticationResponse, Error, AuthenticationRequest>({
//         mutationFn: loginApi,
//         onError: (error: any) => {
//             showError(error.message || 'Đã xảy ra lỗi trong quá trình đăng nhập');
//         },
//     });
// };

import { AuthenticationRequest, AuthenticationResponse } from '../types/auth.types';
import { loginApi } from '../api/auth';
import { useCreateMutation } from '../../../hooks/useCreateMutation';

/**
 * Custom hook để xử lý đăng nhập người dùng
 */
export const useLogin = () => {
  return useCreateMutation<AuthenticationResponse, Error, AuthenticationRequest>(
    loginApi,
    'login',
    'Đăng nhập thành công!',
    'Đã xảy ra lỗi trong quá trình đăng nhập'
  );
};