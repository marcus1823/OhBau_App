import rootApi from '../../../apis/rootApi';
import { GetBlogsRequest, GetBlogsResponse, GetBlogResponse } from '../types/blog.types';

export const getBlogsApi = async (request: GetBlogsRequest): Promise<GetBlogsResponse> => {
  try {
    const response = await rootApi.get('/blog/get-blogs', {
      params: {
        pageNumber: request.pageNumber,
        pageSize: request.pageSize,
      },
    });

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.log('getBlogsApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get blogs: ${error.message}`
        : 'Failed to get blogs: Unknown error'
    );
  }
};

export const getBlogApi = async (blogId: string): Promise<GetBlogResponse> => {
  try {
    const response = await rootApi.get('/blog/get-blog', {
      params: {
        blogId,
      },
    });

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.log('getBlogApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get blog: ${error.message}`
        : 'Failed to get blog: Unknown error'
    );
  }
};