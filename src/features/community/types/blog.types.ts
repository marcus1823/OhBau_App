export interface Blog {
  id: string;
  title: string;
  createdDate: string;
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