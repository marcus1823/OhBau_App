import { useCreateMutation } from '../../../hooks/useCreateMutation';
import { createCommentBlogApi } from '../api/blogApi';
import { CreateCommentResponse } from '../types/blog.types';

interface CreateCommentBlogRequest {
  blogId: string;
  comment: string;
  accessToken: string;
}

export const useCreateCommentBlog = () => {
  return useCreateMutation<CreateCommentResponse, Error, CreateCommentBlogRequest>(
    ({ blogId, comment, accessToken }) => createCommentBlogApi(blogId, comment, accessToken),
    'createCommentBlog',
    // 'Bình luận thành công!',
    // 'Đã xảy ra lỗi khi bình luận'
  );
};