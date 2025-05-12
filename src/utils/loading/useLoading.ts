import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import { clearContextLoading, setContextLoading, setGlobalLoading } from "./loadingSlice";

/**
 * Custom hook để xử lý trạng thái loading toàn cục và theo ngữ cảnh (context)
 */
export const useLoading = () => {
    const dispatch = useDispatch();

    // Lấy trạng thái loading toàn cục từ Redux store
    const globalLoading = useSelector((state: RootState) => state.loading.globalLoading);

    // Lấy trạng thái loading theo từng context từ Redux store
    const contextLoading = useSelector((state: RootState) => state.loading.contextLoading);

    /**
     * Hiển thị loading toàn cục (dùng khi cần chặn toàn bộ UI)
     */
    const showGlobalLoading = () => {
        dispatch(setGlobalLoading(true));
    };

    /**
     * Ẩn loading toàn cục
     */
    const hideGlobalLoading = () => {
        dispatch(setGlobalLoading(false));
    };

    /**
     * Hiển thị loading cho một context cụ thể (ví dụ: 'fetchUser', 'submitForm', v.v.)
     * @param context - Tên định danh của context
     */
    const showContextLoading = (context: string) => {
        dispatch(setContextLoading({ context, isLoading: true }));
    };

    /**
     * Ẩn loading cho một context cụ thể và xoá khỏi danh sách contextLoading
     * @param context - Tên định danh của context
     */
    const hideContextLoading = (context: string) => {
        dispatch(setContextLoading({ context, isLoading: false }));
        dispatch(clearContextLoading(context));
    };

    /**
     * Kiểm tra xem một context cụ thể có đang loading hay không
     * @param context - Tên context cần kiểm tra
     * @returns true nếu context đang loading, ngược lại là false
     */
    const isContextLoading = (context: string) => {
        return !!contextLoading[context];
    };

    return {
        showGlobalLoading,
        hideGlobalLoading,
        showContextLoading,
        hideContextLoading,
        isContextLoading,
        globalLoading,
        contextLoading,
    };
};
