import { useCreateMutation } from '../../../hooks/useCreateMutation';
import { replyCommentBlogApi } from '../api/blogApi';
import { ReplyCommentResponse } from '../types/blog.types';

interface ReplyCommentBlogRequest {
  blogId: string;
  parentId: string;
  comment: string;
  accessToken: string;
}

export const useReplyCommentBlog = () => {
  return useCreateMutation<ReplyCommentResponse, Error, ReplyCommentBlogRequest>(
    ({ blogId, parentId, comment, accessToken }) => replyCommentBlogApi(blogId, parentId, comment, accessToken),
    'replyCommentBlog',
    // 'Trả lời bình luận thành công!',
    // 'Đã xảy ra lỗi khi trả lời bình luận'
  );
};