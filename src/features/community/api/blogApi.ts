import rootApi from '../../../apis/rootApi';
import {
  GetBlogsRequest,
  GetBlogsResponse,
  GetBlogResponse,
  GetCommentsRequest,
  GetCommentsResponse,
  CreateCommentResponse,
  ReplyCommentResponse,
  CreateBlogRequest,
  CreateNewBlogResponseBaseResponse,
} from '../types/blog.types';

export const getBlogsApi = async (request: GetBlogsRequest): Promise<GetBlogsResponse> => {
  try {
    const response = await rootApi.get('/blog/get-blogs', { params: request });

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data as GetBlogsResponse;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('getBlogsApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to get blogs: ${error.message}` : 'Failed to get blogs: Unknown error');
  }
};

export const getBlogApi = async (blogId: string): Promise<GetBlogResponse> => {
  try {
    const response = await rootApi.get('/blog/get-blog', { params: { blogId } });

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data as GetBlogResponse;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('getBlogApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to get blog: ${error.message}` : 'Failed to get blog: Unknown error');
  }
};

export const uploadImageApi = async (image: FormData, accessToken: string): Promise<string> => {
  try {
    const response = await rootApi.post('/upload/upload', image, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    console.log('Backend response:', response.data);
    // if (!response.data?.data) {
    //   throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    // }
  
    return response.data; 
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('uploadImageApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to upload image: ${error.message}` : 'Failed to upload image: Unknown error');
  }
};


export const createBlogApi = async (request: CreateBlogRequest, accessToken: string): Promise<CreateNewBlogResponseBaseResponse> => {
  try {
    const response = await rootApi.post('/blog/create', request, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.data || typeof response.data.status === 'undefined' || typeof response.data.message === 'undefined') {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }
    return response.data as CreateNewBlogResponseBaseResponse;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('createBlogApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to create blog: ${error.message}` : 'Failed to create blog: Unknown error');
  }
};

export const likeAndDislikeBlogApi = async (blogId: string, accessToken: string): Promise<any> => {
  console.log('likeAndDislikeBlogApi req:', blogId);

  try {
    const response = await rootApi.post(`blog/like-dislike/${blogId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.data || typeof response.data.status === 'undefined' || typeof response.data.message === 'undefined') {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('likeAndDislikeBlogApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to like or dislike blog: ${error.message}` : 'Failed to like or dislike blog: Unknown error');
  }
};

export const getCommentBlogsApi = async (request: GetCommentsRequest): Promise<GetCommentsResponse> => {
  console.log('getCommentBlogsApi request:', request);

  try {
    const response = await rootApi.get('/comment/get-comments', { params: request });

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data as GetCommentsResponse;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('getCommentBlogsApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to get comments: ${error.message}` : 'Failed to get comments: Unknown error');
  }
};

export const createCommentBlogApi = async (blogId: string, comment: string, accessToken: string): Promise<CreateCommentResponse> => {
  try {
    const response = await rootApi.post('/comment/comment', { blogId, comment }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || typeof response.data.status === 'undefined' || typeof response.data.message === 'undefined') {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data as CreateCommentResponse;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('createCommentBlogApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to create comment: ${error.message}` : 'Failed to create comment: Unknown error');
  }
};

export const replyCommentBlogApi = async (blogId: string, parentId: string, comment: string, accessToken: string): Promise<ReplyCommentResponse> => {
  try {
    const response = await rootApi.post('/comment/reply', { blogId, parentId, comment }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || typeof response.data.status === 'undefined' || typeof response.data.message === 'undefined') {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data as ReplyCommentResponse;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('replyCommentBlogApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to reply comment: ${error.message}` : 'Failed to reply comment: Unknown error');
  }
};

export const editCommentBlogApi = async (commentId: string, newComment: string, accessToken: string): Promise<any> => {
  try {
    const response = await rootApi.put(`/comment/edit-comment/${commentId}`, { comment: newComment }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response)}`);
    }

    return response.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('editCommentBlogApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to edit comment: ${error.message}` : 'Failed to edit comment: Unknown error');
  }
};

export const deleteCommentBlogApi = async (commentId: string, accessToken: string): Promise<any> => {
  try {
    const response = await rootApi.delete(`/comment/delete-comment/${commentId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response)}`);
    }

    return response.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('deleteCommentBlogApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to delete comment: ${error.message}` : 'Failed to delete comment: Unknown error');
  }
};