import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/slices/auth.slices';
import loadingSlice from '../utils/loading/loadingSlice';

export const store = configureStore({
    reducer: {
        // Slice quản lý thông tin xác thực người dùng
        auth: authSlice,

        // Slice quản lý trạng thái loading (dùng để hiển thị loading toàn cục)
        loading: loadingSlice,
    },

    // Cấu hình middleware mặc định của Redux Toolkit
    // Mặc định đã có redux-thunk, serializableCheck, v.v.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // ✅ Bỏ qua kiểm tra tuần tự hóa với action 'persist/PERSIST'
            // Vì khi dùng redux-persist để lưu state vào AsyncStorage, localStorage,
            // nó sẽ dispatch một số action nội bộ như 'persist/PERSIST'
            // có thể chứa dữ liệu không tuần tự hóa được (như class, function, ...)
            // Nếu không bỏ qua, Redux sẽ cảnh báo hoặc báo lỗi
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

// Kiểu dữ liệu đại diện cho toàn bộ state trong Redux store (dùng cho useSelector)
export type RootState = ReturnType<typeof store.getState>;

// Kiểu dữ liệu cho dispatch của store (dùng cho useDispatch)
export type AppDispatch = typeof store.dispatch;
