import rootApi from "../../../apis/rootApi";
import {
  GetCoursesRequest,
  GetCoursesResponse,
  GetTopicsRequest,
  GetTopicsResponse,
  GetChaptersRequest,
  GetChaptersResponse,
  GetChapterResponse,
  GetMyCoursesRequest,
  GetMyCoursesResponse,
  GetFavoriteCoursesResponse,
  FavoriteCourse,
} from "../types/course.types";

export const addMyCourseApi = async (courseId: string, accessToken: string): Promise<void> => {
  console.log('addMyCourseApi courseId:', courseId);
  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }
  try {
    const response = await rootApi.post('/my-course/receive-course', { courseId }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });
    console.log('addMyCourseApi res:', response.data);
    return response.data; 
    
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.log('addMyCourseApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to add course: ${error.message}`
        : 'Failed to add course: Unknown error'
    );
    
  }
}

export const addFavoriteCourseApi = async (courseId: string, accessToken: string): Promise<void> => {
  console.log('addFavoriteCourseApi courseId:', courseId);
  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }
  try {
    const response = await rootApi.post('/favorite-course/add-favorite-course', { courseId }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });
    console.log('addFavoriteCourseApi res:', response.data);
    return response.data; 
    
  }
  catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.log('addFavoriteCourseApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to add favorite course: ${error.message}`
        : 'Failed to add favorite course: Unknown error'
    );
  }
}

export const getfavoriteCoursesApi = async (pageNumber: number, pageSize: number, accessToken: string): Promise<GetFavoriteCoursesResponse> => {
  console.log('getfavoriteCoursesApi req:', { pageNumber, pageSize });
  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }
  try {
    const response = await rootApi.get('/favorite-course/get-favorite-courses', {
      params: { pageNumber, pageSize },
      headers: {  
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });
    console.log('getfavoriteCoursesApi res:', response.data);
    return response.data; // Return the whole response including status, message and data
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.log('getfavoriteCoursesApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get favorite courses: ${error.message}`
        : 'Failed to get favorite courses: Unknown error'
    );
  }
}

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
    console.log('getCoursesApi error:', errorDetails);
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
    console.log('getMyCoursesApi error:', errorDetails);
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
    console.log('getTopicsApi error:', errorDetails);
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
    console.log('getChaptersApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get chapters: ${error.message}`
        : 'Failed to get chapters: Unknown error'
    );
  }
};

export const getChapterApi = async (chapterId: string): Promise<GetChapterResponse> => {
  console.log('getChapterApi req:', chapterId);

  try {
    const response = await rootApi.get('/get-chapter', {
      params: { chapterId }
    });

    console.log('getChapterApi res:', response.data);

    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data.data 
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
      chapterId,
    };
    console.log('getChapterApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get chapter: ${error.message}`
        : 'Failed to get chapter: Unknown error'
    );
  }
};

/**
 * API to check course status (if it's in favorites and my courses)
 * This is a new function that combines both checks in one API call
 */
export const checkCourseStatusApi = async (courseId: string, accessToken: string): Promise<{isInFavorites: boolean, isInMyCourses: boolean}> => {
  console.log('checkCourseStatusApi courseId:', courseId);
  if (!accessToken) {
    throw new Error('Vui lòng đăng nhập lại để thực hiện chức năng.');
  }
  
  try {
    // Since we don't have a direct API for this, we'll make two requests in parallel
    const [favoritesResponse, myCoursesResponse] = await Promise.all([
      getfavoriteCoursesApi(1, 100, accessToken),
      getMyCoursesApi({ pageSize: 100, pageNumber: 1 }, accessToken)
    ]);
    
    // Check if course is in favorites
    const favoriteIds = favoritesResponse.data.items.map((course: FavoriteCourse) => course.courseId);
    const isInFavorites = favoriteIds.includes(courseId);
    
    // Check if course is in my courses
    const myCourseIds = myCoursesResponse.items.map(course => course.id);
    const isInMyCourses = myCourseIds.includes(courseId);
    
    console.log('checkCourseStatusApi result:', { isInFavorites, isInMyCourses });
    
    return { isInFavorites, isInMyCourses };
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.log('checkCourseStatusApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to check course status: ${error.message}`
        : 'Failed to check course status: Unknown error'
    );
  }
};

// Comment out cart-related APIs that are no longer needed
/*
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
    console.log('addCourseToCartApi error:', errorDetails);
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
    console.log('getCartItemsDetailsApi error:', errorDetails);
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
    console.log('getCartItemsByAccountApi error:', errorDetails);
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
    console.log('deleteCartItemApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to delete cart item: ${error.message}`
        : 'Failed to delete cart item: Unknown error'
    );
  }
};
*/
// export const createOrderApi = async (cartId: string, accessToken: string): Promise<CreateOrderResponse> => {
//   console.log('createOrderApi req:', { cartId });

//   if (!accessToken) {
//     throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
//   }

//   try {
//     const response = await rootApi.post('/order/create-order', { cartId }, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         accept: 'application/json',
//       },
//     });

//     console.log('createOrderApi res:', response);

//     if (!response.data?.data) {
//       throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
//     }

//     return response.data.data;
//   } catch (error) {
//     const errorDetails = {
//       message: error instanceof Error ? error.message : 'Unknown error',