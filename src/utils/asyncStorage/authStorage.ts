import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm để lưu accessToken vào AsyncStorage
export const storeAccessToken = async (accessToken: string): Promise<void> => {
    try {
        // Sử dụng AsyncStorage để lưu accessToken dưới key 'accessToken'
        await AsyncStorage.setItem('accessToken', accessToken);
    } catch (error) {
        // Bắt lỗi nếu có vấn đề trong quá trình lưu trữ
        console.error('Error storing access token:', error);
    }
}

// Hàm để lấy accessToken từ AsyncStorage
export const getAccessToken = async (): Promise<string | null> => {
    try {
        // Lấy giá trị của 'accessToken' từ AsyncStorage
        const accessToken = await AsyncStorage.getItem('accessToken');
        return accessToken; // Trả về giá trị accessToken, nếu không có sẽ trả về null
    } catch (error) {
        // Bắt lỗi nếu có vấn đề trong quá trình lấy dữ liệu
        console.error('Error retrieving access token:', error);
        return null; // Trả về null nếu có lỗi xảy ra
    }
}

// Hàm để xóa thông tin (accessToken và role) khỏi AsyncStorage
export const clearData = async (): Promise<void> => {
    try {
        // Xóa 'accessToken' và 'role' khỏi AsyncStorage
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('role');
    } catch (error) {
        // Bắt lỗi nếu có vấn đề trong quá trình xóa dữ liệu
        console.error('Error clearing data:', error);
    }
}
