import { useDispatch } from 'react-redux';
import { setAccessToken, setRole } from '../../features/auth/slices/auth.slices';
import { getAccessToken, storeAccessToken } from './authStorage';
import { role } from '../../features/auth/types/auth.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLoading } from '../loading/useLoading';

/**
 * Custom hook để đồng bộ hóa trạng thái xác thực (auth) với Redux và AsyncStorage
 */
export const useAuthSync = () => {
  const dispatch = useDispatch();
  const { showGlobalLoading, hideGlobalLoading } = useLoading();

  /**
   * Đồng bộ accessToken vào Redux store và AsyncStorage
   * @param accessToken - Chuỗi accessToken cần đồng bộ
   */
  const syncAccessToken = async (accessToken: string) => {
    try {
      dispatch(setAccessToken(accessToken));
      await storeAccessToken(accessToken);
    } catch (error: any) {
      console.log('Sync access token error:', error);
      throw error;
    }
  };

  /**
   * Đồng bộ role vào Redux store và AsyncStorage
   * @param roleValue - Giá trị role (ví dụ: 'user', 'admin')
   */
  const syncRole = async (roleValue: role) => {
    try {
      dispatch(setRole(roleValue));
      await AsyncStorage.setItem('role', roleValue);
    } catch (error: any) {
      console.log('Sync role error:', error);
      throw error;
    }
  };

  /**
   * đồng bộ account Id vào AsyncStorage
   * @param id - ID của tài khoản người dùng
   */
  const syncAccountId = async (id: string) => {
    try {
      await AsyncStorage.setItem('accountId', id);
    } catch (error: any) {
      console.log('Sync account ID error:', error);
      throw error;
    }
  };

  /**
   * Khởi tạo auth bằng cách kiểm tra và đồng bộ accessToken/role từ AsyncStorage
   * @returns Object xác nhận trạng thái khởi tạo (thành công hoặc lỗi)
   */
  const initializeAuth = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      showGlobalLoading();
      const accessToken = await getAccessToken();
      const storedRole = await AsyncStorage.getItem('role') as role | null;
      const accountId = await AsyncStorage.getItem('accountId');


      if (accessToken) {
        await syncAccessToken(accessToken);
      }
      if (storedRole) {
        await syncRole(storedRole);
      }
      if (accountId) {
        await syncAccountId(accountId);
      }
      return { success: true };
    } catch (error: any) {
      console.log('Initialize auth error:', error);
      throw { success: false, error: error.message };
    } finally {
      hideGlobalLoading();
    }
  };

  return {
    syncAccessToken,
    syncRole,
    syncAccountId,
    initializeAuth,
  };
};