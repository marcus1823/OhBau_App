import AsyncStorage from '@react-native-async-storage/async-storage';


export const storeAccessToken = async (accessToken: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('accessToken', accessToken);
    } catch (error) {
        console.error('Error storing access token:', error);
    }
}

export const getAccessToken = async (): Promise<string | null> => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        return accessToken;
    } catch (error) {
        console.error('Error retrieving access token:', error);
        return null;
    }
}

export const clearData = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('role');
    } catch (error) {
        console.error('Error clearing data:', error);
    }
}

