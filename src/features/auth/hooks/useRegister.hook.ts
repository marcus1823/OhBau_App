import { useMutation } from '@tanstack/react-query';
import { RegisterRequest, RegisterResponseBaseResponse, } from '../types/auth.types';
import { useToast } from '../../../utils/toasts/useToast';
import { registerApi } from '../api/auth';

export const useRegister = () => {
    const { showError } = useToast();

    return useMutation<RegisterResponseBaseResponse, Error, RegisterRequest>({
        mutationFn: registerApi,
        onError: (error: any) => {
            showError(error.message || 'Đã xảy ra lỗi trong quá trình đăng ký tài khoản');
        }
    });
}