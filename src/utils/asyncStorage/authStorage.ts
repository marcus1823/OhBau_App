import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Lưu accessToken vào AsyncStorage
 * @param accessToken - Chuỗi accessToken cần lưu
 */
export const storeAccessToken = async (accessToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
  } catch (error) {
    console.error('Error storing access token:', error);
  }
};

/**
 * Lấy accessToken từ AsyncStorage
 * @returns Chuỗi accessToken hoặc null nếu không tồn tại/lỗi
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return accessToken;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};

/**
 * Xóa accessToken và role khỏi AsyncStorage
 */
export const clearData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('role');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};