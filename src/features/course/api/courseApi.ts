import rootApi from "../../../apis/rootApi";
import {
  GetCoursesRequest,
  GetCoursesResponse,
  GetTopicsRequest,
  GetTopicsResponse,
  GetChaptersRequest,
  GetChaptersResponse,
  GetChapterRequest,
  GetChapterResponse,
  GetMyCoursesRequest,
  GetMyCoursesResponse,
  CreateOrderResponse,
  GetCartItemsDetailsResponse,
  GetCartItemsByAccountResponse
} from "../types/course.types";

export const getCoursesApi = async (request: GetCoursesRequest): Promise<GetCoursesResponse> => {
  console.log('getCoursesApi req:', request);

  try {
    const response = await rootApi.get('/course/get-courses', {
      params: request
    });

    console.log('getCoursesApi res:', response);

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
      request,
    };
    console.error('getCoursesApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get courses: ${error.message}`
        : 'Failed to get courses: Unknown error'
    );
  }
};

export const getMyCoursesApi = async (
  request: GetMyCoursesRequest,
  accessToken: string
): Promise<GetMyCoursesResponse> => {
  console.log('getMyCoursesApi req:', request);

  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }

  try {
    const response = await rootApi.get('/my-course/my-course', {
      params: request,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });

    console.log('getMyCoursesApi res:', response);

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
      request,
    };
    console.error('getMyCoursesApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get my courses: ${error.message}`
        : 'Failed to get my courses: Unknown error'
    );
  }
};

export const getTopicsApi = async (request: GetTopicsRequest): Promise<GetTopicsResponse> => {
  console.log('getTopicsApi req:', request);

  try {
    const response = await rootApi.get('/course/get-topics', {
      params: request
    });

    console.log('getTopicsApi res:', response);

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
      request,
    };
    console.error('getTopicsApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get topics: ${error.message}`
        : 'Failed to get topics: Unknown error'
    );
  }
};

export const getChaptersApi = async (request: GetChaptersRequest): Promise<GetChaptersResponse> => {
  console.log('getChaptersApi req:', request);

  try {
    const response = await rootApi.get('/get-chapters', {
      params: request
    });

    console.log('getChaptersApi res:', response);

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
      request,
    };
    console.error('getChaptersApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get chapters: ${error.message}`
        : 'Failed to get chapters: Unknown error'
    );
  }
};

export const getChapterApi = async (request: GetChapterRequest): Promise<GetChapterResponse> => {
  console.log('getChapterApi req:', request);

  try {
    const response = await rootApi.get('/get-chapter', {
      params: request
    });

    console.log('getChapterApi res:', response);

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
      request,
    };
    console.error('getChapterApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get chapter: ${error.message}`
        : 'Failed to get chapter: Unknown error'
    );
  }
};

// ... (other functions remain unchanged)

export const addCourseToCartApi = async (courseId: string, accessToken: string): Promise<void> => {
  console.log('addCourseToCartApi courseId:', courseId);

  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }

  try {
    const response = await rootApi.post('/cart/add-course-to-cart', { courseId }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });

    console.log('addCourseToCartApi res:', response.data);

    if (response.status !== 200 && response.status !== 208) {
      throw new Error(`Failed to add course to cart: ${response.statusText}`);
    }
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('addCourseToCartApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to add course to cart: ${error.message}`
        : 'Failed to add course to cart: Unknown error'
    );
  }
};

export const getCartItemsDetailsApi = async (pageNumber: number, pageSize: number, accessToken: string): Promise<GetCartItemsDetailsResponse> => {
  console.log('getCartItemsDetailsApi req:', { pageNumber, pageSize });

  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }

  try {
    const response = await rootApi.get('/cart/get-cart-items-details', {
      params: { pageNumber, pageSize },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });

    console.log('getCartItemsDetailsApi res:', response);

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('getCartItemsDetailsApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get cart items details: ${error.message}`
        : 'Failed to get cart items details: Unknown error'
    );
  }
};

export const getCartItemsByAccountApi = async (pageNumber: number, pageSize: number, accessToken: string): Promise<GetCartItemsByAccountResponse> => {
  console.log('getCartItemsByAccountApi req:', { pageNumber, pageSize });

  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }

  try {
    const response = await rootApi.get('/cart/get-cart-items-by-account', {
      params: { pageNumber, pageSize },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });

    console.log('getCartItemsByAccountApi res:', response);

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('getCartItemsByAccountApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get cart items by account: ${error.message}`
        : 'Failed to get cart items by account: Unknown error'
    );
  }
};

export const deleteCartItemApi = async (itemId: string, accessToken: string): Promise<void> => {
  console.log('deleteCartItemApi req:', { itemId });

  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }

  try {
    const response = await rootApi.delete(`/cart/delete-cart-item?itemId=${itemId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });

    console.log('deleteCartItemApi res:', response);

    if (response.status !== 200) {
      throw new Error(`Failed to delete cart item: ${response.statusText}`);
    }
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('deleteCartItemApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to delete cart item: ${error.message}`
        : 'Failed to delete cart item: Unknown error'
    );
  }
};
export const createOrderApi = async (cartId: string, accessToken: string): Promise<CreateOrderResponse> => {
  console.log('createOrderApi req:', { cartId });

  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }

  try {
    const response = await rootApi.post('/order/create-order', { cartId }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });

    console.log('createOrderApi res:', response);

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('createOrderApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to create order: ${error.message}`
        : 'Failed to create order: Unknown error'
    );
  }
};

export const createPaymentApi = async (OrderCode: string, Des: string, accessToken: string): Promise<string> => {
  console.log('createPaymentApi req:', { OrderCode, Des });

  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }

  try {
    const response = await rootApi.get(`/payment/create-payment`, {
      params: {
        OrderCode: OrderCode,
        Des: encodeURIComponent(Des),
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });

    console.log('createPaymentApi res:', response);

    if (!response.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data; // Returns the payment URL string
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('createPaymentApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to create payment: ${error.message}`
        : 'Failed to create payment: Unknown error'
    );
  }
};