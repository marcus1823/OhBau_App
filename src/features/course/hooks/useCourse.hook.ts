import { addCourseToCartApi, deleteCartItemApi, createOrderApi } from '../api/courseApi';
import { useSelector, useDispatch } from 'react-redux';
import { setAddedCourses } from '../slices/cartSlice';
import { CreateOrderResponse } from '../types/course.types';
import { AppDispatch, RootState } from '../../../stores/store';
import { useCreateMutation } from '../../../hooks/useCreateMutation';

/**
 * Custom hook để xử lý thêm khóa học vào giỏ hàng
 */
export const useAddCourseToCart = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch<AppDispatch>();
  const addedCourses = useSelector((state: RootState) => state.cart.addedCourses || []);

  return useCreateMutation<void, Error, { courseId: string; isBuyNow?: boolean }>(
    async (variables) => {
      if (!accessToken) {throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');}
      await addCourseToCartApi(variables.courseId, accessToken);
    },
    'addCourseToCart',
    'Thêm vào giỏ hàng thành công!',
    'Đã xảy ra lỗi khi thêm vào giỏ hàng',
    {
      onMutate: (variables) => {
        if (!addedCourses.includes(variables.courseId)) {
          dispatch(setAddedCourses([...addedCourses, variables.courseId]));
        }
      },
      onSuccess: (data, variables) => {
        if (!addedCourses.includes(variables.courseId)) {
          dispatch(setAddedCourses([...addedCourses, variables.courseId]));
        }
      },
      onError: (error, variables) => {
        if (error instanceof Error && !error.message.includes('208')) {
          dispatch(setAddedCourses(addedCourses.filter(id => id !== variables.courseId)));
        }
        if (error instanceof Error && error.message.includes('208')) {
          dispatch(setAddedCourses([...addedCourses, variables.courseId]));
        }
      },
    }
  );
};

/**
 * Custom hook để xử lý xóa khóa học khỏi giỏ hàng
 */
export const useDeleteCartItem = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return useCreateMutation<void, Error, { itemId: string }>(
    async (variables) => {
      if (!accessToken) {throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');}
      await deleteCartItemApi(variables.itemId, accessToken);
    },
    'deleteCartItem',
    'Xóa sản phẩm khỏi giỏ hàng thành công!',
    'Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng'
  );
};

/**
 * Custom hook để xử lý tạo đơn hàng
 */
export const useCreateOrder = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return useCreateMutation<CreateOrderResponse, Error, { cartId: string }>(
    async (variables) => {
      if (!accessToken) {throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');}
      return await createOrderApi(variables.cartId, accessToken);
    },
    'createOrder',
    'Đặt hàng thành công!',
    'Đã xảy ra lỗi khi đặt hàng'
  );
};