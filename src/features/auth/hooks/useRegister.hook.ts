// import { useMutation } from '@tanstack/react-query';
// import { RegisterRequest, RegisterResponseBaseResponse, } from '../types/auth.types';
// import { useToast } from '../../../utils/toasts/useToast';
// import { registerApi } from '../api/auth';

import { useCreateMutation } from "../../../hooks/useCreateMutation"
import { registerApi } from "../api/auth"
import { RegisterRequest, RegisterResponseBaseResponse } from "../types/auth.types"

// export const useRegister = () => {
//     const { showError } = useToast();

//     return useMutation<RegisterResponseBaseResponse, Error, RegisterRequest>({
//         mutationFn: registerApi,
//         onError: (error: any) => {
//             showError(error.message || 'Đã xảy ra lỗi trong quá trình đăng ký tài khoản');
//         }
//     });
// }

/** 
 * Custom hook để xử lý đăng ký người dùng
 */

export const useRegister = () => {
    return useCreateMutation<RegisterResponseBaseResponse, Error, RegisterRequest>(
        registerApi,
        'register',
        'Đăng ký thành công!',
        'Đã xảy ra lỗi trong quá trình đăng ký tài khoản'
    )
}