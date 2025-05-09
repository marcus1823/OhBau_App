import { useDispatch } from "react-redux";
import { setAccessToken, setRole } from "../../features/auth/slices/auth.slices";
import { getAccessToken, storeAccessToken } from "./authStorage";
import { role } from "../../features/auth/types/auth.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLoading } from "../loading/useLoading";

export const useAuthSync = () => {
    const dispatch = useDispatch();
    const { showGlobalLoading, hideGlobalLoading } = useLoading();

    const syncAccessToken = async (accessToken: string) => {
        try {
            dispatch(setAccessToken(accessToken));
            await storeAccessToken(accessToken);
        } catch (error: any) {
            console.error('Sync access token error:', error);
            throw error;
        }
    };

    const syncRole = async (roleValue: role) => {
        try {
            dispatch(setRole(roleValue));
            await AsyncStorage.setItem('role', roleValue);
        } catch (error: any) {
            console.error('Sync role error:', error);
            throw error;
        }
    };

    const initializeAuth = async () => {
        try {
            showGlobalLoading();
            const accessToken = await getAccessToken();
            const storedRole = await AsyncStorage.getItem('role') as role | null;

            if (accessToken) {
                await syncAccessToken(accessToken);
            }
            if (storedRole) {
                await syncRole(storedRole);
            }
        } catch (error: any) {
            console.error('Initialize auth error:', error);
            throw error;
        } finally {
            hideGlobalLoading();
        }
    };

    return {
        syncAccessToken,
        syncRole,
        initializeAuth,
    };
};