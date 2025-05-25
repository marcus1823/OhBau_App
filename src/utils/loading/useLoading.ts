import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/store';
import { setGlobalLoading, setContextLoading } from './loadingSlice';

/**
 * Custom hook để quản lý trạng thái loading toàn cục và theo ngữ cảnh
 */
export const useLoading = () => {
  const dispatch = useDispatch();
  const { globalLoading, contextLoading } = useSelector((state: RootState) => state.loading);

  /**
   * Hiển thị loading toàn cục
   */
  const showGlobalLoading = () => dispatch(setGlobalLoading(true));

  /**
   * Ẩn loading toàn cục
   */
  const hideGlobalLoading = () => dispatch(setGlobalLoading(false));

  /**
   * Hiển thị hoặc ẩn loading cho một ngữ cảnh cụ thể
   * @param context - Tên định danh của ngữ cảnh
   * @param isLoading - Trạng thái loading (true: hiển thị, false: ẩn và xóa)
   */
  const setContextLoadingState = (context: string, isLoading: boolean) =>
    dispatch(setContextLoading({ context, isLoading }));

  /**
   * Kiểm tra một ngữ cảnh có đang loading hay không
   * @param context - Tên ngữ cảnh cần kiểm tra
   * @returns true nếu ngữ cảnh đang loading, ngược lại là false
   */
  const isContextLoading = (context: string) => !!contextLoading[context];

  return {
    showGlobalLoading,
    hideGlobalLoading,
    setContextLoadingState,
    isContextLoading,
    globalLoading,
    contextLoading,
  };
};