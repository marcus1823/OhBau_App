import rootApi from "../../../apis/rootApi";
import { AuthenticationRequest, AuthenticationResponse, RegisterRequest, RegisterResponseBaseResponse,  } from "../types/auth.types";

export const loginApi = async (request: AuthenticationRequest): Promise<AuthenticationResponse> => {
    try {
        const response = await rootApi.post('/auth', request);
        if (!response.data?.data) {
            throw new Error('Invalid response structure');
        }
        return response.data.data;
    } catch (error: any) {
        const errorData = error.response?.data || {};
        throw new Error(errorData.message || error.response?.data || 'Đã xảy ra lỗi khi kết nối đến server');
    }
};


// {
//     "phone": "0987654321",
//     "email": "cuongtq@gmail.com",
//     "password": "123456",
//     "role": "FATHER/MOTHER",
//     "registerParentRequest": {
//       "fullName": "Father 1",
//       "dob": "1990-05-01"
//     }
export const registerApi = async (request: RegisterRequest): Promise<RegisterResponseBaseResponse> => {
    console.log('registerApi request:', request);
    try {
        const response = await rootApi.post('/account', request);
        if (!response.data) {
            throw new Error('Invalid response structure');
        }
        
        return response.data as RegisterResponseBaseResponse;
    } catch (error: any) {
        const errorData = error.response?.data || {};
        throw new Error(errorData.message || error.response?.data || 'Đã xảy ra lỗi khi kết nối đến server');
    }
} 