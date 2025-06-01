import { useCreateMutation } from '../../../hooks/useCreateMutation';
import { likeAndDislikeBlogApi } from '../api/blogApi';
import { LikeAndDislikeBlogResponse } from '../types/blog.types';

interface LikeAndDislikeBlogRequest {
  blogId: string;
  accessToken: string;
}

/**
 * Custom hook để xử lý hành động thích/không thích bài viết
 */
export const useLikeAndDislikeBlog = () => {
  return useCreateMutation<LikeAndDislikeBlogResponse, Error, LikeAndDislikeBlogRequest>(
    ({ blogId, accessToken }) => likeAndDislikeBlogApi(blogId, accessToken),
    'likeAndDislikeBlog',
    // 'Thành công!',
    // 'Đã xảy ra lỗi khi thích/không thích bài viết'
  );
};