export interface LikeBlog {
  accountId: string;
  isLiked: boolean;
}

export interface BlogStatusEnum {
  Pending: 'Pending';
  Published: 'Published';
  Rejected: 'Rejected';
}

export interface CreateBlogRequest {
  title?: string;
  content?: string;
}

export interface CreateNewBlogResponse {
  id: string;
  title: string;
  content: string;
  status: BlogStatusEnum;
}

export interface CreateNewBlogResponseBaseResponse {
  status: string;
  message: string;
  data: CreateNewBlogResponse | null;
}

export interface UploadImageResponse {
  status: string;
  message: string;
  data: { url: string };
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  authorEmail: string;
  totalLike: number;
  totalComment: number;
  likeBlogs: LikeBlog[];
}

export interface BlogDetail {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  updatedDate: string | null;
  status: string;
  reasonReject: string | null;
  email: string;
  isDelete: boolean;
  deletedDate: string | null;
  totalComment: number;
  totalLike: number;
  likeBlogs: LikeBlog[];
}

export interface BlogResponsePaginate {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Blog[];
}

export interface GetBlogResponse {
  status: string;
  message: string;
  data: BlogDetail;
}

export interface GetBlogsResponse {
  status: string;
  message: string;
  data: BlogResponsePaginate;
}

export interface GetBlogsRequest {
  pageSize: number;
  pageNumber: number;
}

export interface GetCommentsRequest {
  blogId: string;
  pageNumber: number;
  pageSize: number;
}

export interface Comment {
  id: string;
  comment: string;
  email: string;
  createdDate: string;
  updatedDate: string | null;
  replies: Comment[];
}

export interface CommentResponsePaginate {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Comment[];
}

export interface GetCommentsResponse {
  status: string;
  message: string;
  data: CommentResponsePaginate;
}

export interface CreateCommentResponse {
  status: string;
  message: string;
  data: Comment | null; 
}

export interface ReplyCommentResponse {
  status: string;
  message: string;
  data: Comment | null;
}

export interface LikeAndDislikeBlogResponse {
  status: string;
  message: string;
  data: null;
}