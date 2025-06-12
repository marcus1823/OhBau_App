import { addFavoriteCourseApi, addMyCourseApi, getfavoriteCoursesApi, getMyCoursesApi, checkCourseStatusApi } from '../api/courseApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { useCreateMutation } from '../../../hooks/useCreateMutation';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { FavoriteCourse } from '../types/course.types';

/**
 * Custom hook for checking if a course is in user's favorites directly via API
 */
export const useIsCourseInFavorites = (courseId: string) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  
  return useQuery({
    queryKey: ['isFavoriteCourse', courseId],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
      }
      const response = await getfavoriteCoursesApi(1, 100, accessToken);
      const favoriteIds = response.data.items.map((course: FavoriteCourse) => course.courseId);
      return favoriteIds.includes(courseId);
    },
    enabled: !!accessToken && !!courseId,
    staleTime: 30 * 1000, // 30 seconds cache for favorite status
    refetchOnWindowFocus: false,
  });
};

/**
 * Custom hook for checking if a course is in user's "My Courses" directly via API
 */
export const useIsCourseInMyCourses = (courseId: string) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  
  return useQuery({
    queryKey: ['isInMyCourse', courseId],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
      }
      const response = await getMyCoursesApi({ pageSize: 100, pageNumber: 1 }, accessToken);
      const myCourseIds = response.items.map(course => course.id);
      return myCourseIds.includes(courseId);
    },
    enabled: !!accessToken && !!courseId,
    staleTime: 30 * 1000, // 30 seconds cache for my course status
    refetchOnWindowFocus: false,
  });
};

/**
 * Combined hook for checking both favorite and my course status in one API call
 * This is more efficient when both statuses are needed
 */
export const useCourseStatus = (courseId: string) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  
  return useQuery({
    queryKey: ['courseStatus', courseId],
    queryFn: async () => {
      if (!accessToken || !courseId) {
        return { isInFavorites: false, isInMyCourses: false };
      }
      
      const status = await checkCourseStatusApi(courseId, accessToken);
      return {
        isInFavorites: status.isInFavorites,
        isInMyCourses: status.isInMyCourses
      };
    },
    enabled: !!accessToken && !!courseId,
    staleTime: 30 * 1000, // 30 seconds cache
    refetchOnWindowFocus: false,
  });
};

/**
 * Custom hook để xử lý thêm khóa học vào khoá học của tôi
 */
export const useAddCourseToMyCourses = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const queryClient = useQueryClient();
  
  return useCreateMutation<void, Error, { courseId: string }>(
    async (variables) => {
      if (!accessToken) {
        throw new Error('Vui lòng đăng nhập để thực hiện chức năng.');
      }
      await addMyCourseApi(variables.courseId, accessToken);
    },
    'addCourseToMyCourses',
    'Thêm khóa học thành công!',
    'Đã xảy ra lỗi khi thêm khóa học vào khoá học của tôi',
    {
      onSuccess: (data, variables) => {
        // Invalidate related queries to refresh status
        queryClient.invalidateQueries({ queryKey: ['myCourses'] });
        queryClient.invalidateQueries({ queryKey: ['isInMyCourse', variables.courseId] });
        queryClient.invalidateQueries({ queryKey: ['courseStatus', variables.courseId] });
      },
    }
  );
};

/**
 * Custom hook để xử lý thêm/xóa khóa học vào danh sách yêu thích
 */
export const useToggleFavoriteCourse = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const queryClient = useQueryClient();

  return useCreateMutation<void, Error, { courseId: string }>(
    async (variables) => {
      if (!accessToken) {
        throw new Error('Vui lòng đăng nhập để thực hiện chức năng.');
      }
      await addFavoriteCourseApi(variables.courseId, accessToken);
    },
    'toggleFavoriteCourse',
    '', // Empty success message - we'll handle it manually
    'Đã xảy ra lỗi khi cập nhật danh sách yêu thích',
    {
      onSuccess: (data, variables) => {
        // Invalidate related queries to refresh status
        queryClient.invalidateQueries({ queryKey: ['favoriteCourses'] });
        queryClient.invalidateQueries({ queryKey: ['isFavoriteCourse', variables.courseId] });
        queryClient.invalidateQueries({ queryKey: ['courseStatus', variables.courseId] });
      },
    }
  );
};

/**
 * Custom hook để lấy danh sách khóa học yêu thích
 */
export const useFetchFavoriteCourses = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return useQuery({
    queryKey: ['favoriteCourses'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Vui lòng đăng nhập để thực hiện chức năng.');
      }
      const response = await getfavoriteCoursesApi(1, 100, accessToken);
      return response.data.items;
    },
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds cache
  });
};

// Comment out the cart-related hooks that are no longer needed
/*
// ...existing code...
*/