import { useCreateMutation } from '../../../hooks/useCreateMutation';
import { createBlogApi } from '../api/blogApi';
import { CreateNewBlogResponseBaseResponse, CreateBlogRequest } from '../types/blog.types';

interface CreateBlogRequestWithToken extends CreateBlogRequest {
  accessToken: string;
}

export const useCreateBlog = () => {
  return useCreateMutation<CreateNewBlogResponseBaseResponse, Error, CreateBlogRequestWithToken>(
    ({ title, content, accessToken }) => createBlogApi({ title, content }, accessToken),
    'createBlog',
    'Tạo bài viết thành công!',
    'Đã xảy ra lỗi khi tạo bài viết'
  );
};