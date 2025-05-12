import { useDispatch } from "react-redux";
import { setAccessToken, setRole } from "../../features/auth/slices/auth.slices"; 
import { getAccessToken, storeAccessToken } from "./authStorage"; 
import { role } from "../../features/auth/types/auth.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLoading } from "../loading/useLoading"; 

export const useAuthSync = () => {
    const dispatch = useDispatch(); // Lấy dispatch để gửi action tới Redux
    const { showGlobalLoading, hideGlobalLoading } = useLoading(); // Hook xử lý loading toàn cầu

    // Hàm đồng bộ hóa accessToken vào Redux store và AsyncStorage
    const syncAccessToken = async (accessToken: string) => {
        try {
            // Gửi action để cập nhật accessToken vào Redux store
            dispatch(setAccessToken(accessToken));

            // Lưu accessToken vào AsyncStorage để sử dụng sau này (giữ trạng thái đăng nhập)
            await storeAccessToken(accessToken);
        } catch (error: any) {
            // Xử lý lỗi khi đồng bộ hóa accessToken
            console.error('Sync access token error:', error);
            throw error; // Ném lỗi ra ngoài để gọi hàm này có thể biết được vấn đề
        }
    };

    // Hàm đồng bộ hóa role vào Redux store và AsyncStorage
    const syncRole = async (roleValue: role) => {
        try {
            // Gửi action để cập nhật role vào Redux store
            dispatch(setRole(roleValue));

            // Lưu role vào AsyncStorage để sử dụng lại sau này
            await AsyncStorage.setItem('role', roleValue);
        } catch (error: any) {
            // Xử lý lỗi khi đồng bộ hóa role
            console.error('Sync role error:', error);
            throw error; // Ném lỗi ra ngoài
        }
    };

    // Hàm khởi tạo auth, kiểm tra và đồng bộ hóa accessToken và role từ AsyncStorage
    const initializeAuth = async () => {
        try {
            showGlobalLoading(); // Hiển thị loading khi khởi tạo auth

            // Lấy accessToken từ AsyncStorage
            const accessToken = await getAccessToken();

            // Lấy role từ AsyncStorage
            const storedRole = await AsyncStorage.getItem('role') as role | null;

            // Nếu có accessToken thì đồng bộ vào Redux và AsyncStorage
            if (accessToken) {
                await syncAccessToken(accessToken);
            }

            // Nếu có role thì đồng bộ vào Redux và AsyncStorage
            if (storedRole) {
                await syncRole(storedRole);
            }
        } catch (error: any) {
            // Xử lý lỗi trong quá trình khởi tạo auth
            console.error('Initialize auth error:', error);
            throw error;
        } finally {
            hideGlobalLoading(); // Ẩn loading sau khi hoàn thành hoặc gặp lỗi
        }
    };

    // Trả về các hàm để có thể sử dụng ở nơi khác trong app
    return {
        syncAccessToken,
        syncRole,
        initializeAuth,
    };
};
