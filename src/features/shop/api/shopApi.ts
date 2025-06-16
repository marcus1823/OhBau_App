import rootApi from "../../../apis/rootApi";
import { 
  GetCategoryRequest, 
  GetProductBaseResponse, 
  GetProductByCategoryRequest, 
  GetProductCategoryResponsePaginate, 
  GetProductRequest, 
  GetProductResponsePaginate,
  GetCartItemsByAccountBaseResponse,
  GetCartItemsDetailsBaseResponse,
  CartBaseResponse,
  ReturnPaymentRequest,
} from "../types/shops.types";


export const getCategoryApi = async (request: GetCategoryRequest):Promise<GetProductCategoryResponsePaginate> => {
    console.log("getCategoryApi called with request:", request);
    try {
        const response = await rootApi.get(`/product-category`, { params: request });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching product categories:", error);
        throw error;
    }
}

export const getProductByCategoryApi = async (request: GetProductByCategoryRequest): Promise<GetProductCategoryResponsePaginate> => {
    console.log("getProductByCategoryApi called with request:", request);
    try {
        const response = await rootApi.get(`/product-category/${request.id}/products`, { params: request });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        throw error;
    }
}

export const getProductApi = async (request: GetProductRequest):Promise<GetProductResponsePaginate> => {
    console.log("getProductApi called with request:", request);
    try {
        const response = await rootApi.get(`/product`, { params: request });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}


export const getProductByIdApi = async (id: string): Promise<GetProductBaseResponse> => {
    console.log("getProductByIdApi called with id:", id);
    try {
        const response = await rootApi.get(`/product/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
}

export const addProductToCartApi = async (productId: string, quantity: number, accessToken: string): Promise<CartBaseResponse> => {
    console.log("addProductToCartApi called with productId:", productId, "quantity:", quantity);
    try {
        const response = await rootApi.post(`/cart/add-product-to-cart`, { productId, quantity }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding product to cart:", error);
        throw error;
    }
}

export const getCartItemsByAccountApi = async (pageNumber: number, pageSize: number, accessToken: string): Promise<GetCartItemsByAccountBaseResponse> => {
    console.log("getCartItemsByAccountApi called with pageNumber:", pageNumber, "pageSize:", pageSize);
    try {
        const response = await rootApi.get(`/cart/get-cart-items-by-account`, {
            params: { pageNumber, pageSize },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting cart items by account:", error);
        throw error;
    }
}

export const updateItemQuantityApi = async (itemId: string, quantity: number, accessToken: string): Promise<CartBaseResponse> => {
    console.log("updateItemQuantityApi called with itemId:", itemId, "quantity:", quantity);
    try {
        // Create FormData object
        const formData = new FormData();
        formData.append('quantity', quantity.toString());
        
        const response = await rootApi.put(`/cart/update-item-quantity/${itemId}`, formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
                'accept': '/'
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating item quantity:", error);
        throw error;
    }
}

export const getCartItemsDetailsApi = async (pageNumber: number, pageSize: number, accessToken: string): Promise<GetCartItemsDetailsBaseResponse> => {
    console.log("getCartItemsDetailsApi called with pageNumber:", pageNumber, "pageSize:", pageSize);
    try {
        const response = await rootApi.get(`/cart/get-cart-items-details`, {
            params: { pageNumber, pageSize },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting cart items details:", error);
        throw error;
    }
}

export const deleteCartItemApi = async (itemId: string, accessToken: string): Promise<CartBaseResponse> => {
    console.log("deleteCartItemApi called with itemId:", itemId);
    
    if (!accessToken) {
        throw new Error('Authentication token is missing');
    }
    
    if (!itemId) {
        throw new Error('Item ID is required');
    }
    
    try {
        const response = await rootApi.delete(`/cart/delete-cart-item`, {
            params: { itemId },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                accept: 'application/json',
            },
        });
        
        console.log("deleteCartItemApi response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error deleting cart item:", error);
        
        // More detailed error handling
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            
            // Return success response if server returned 200 but with error message
            // Sometimes the server might return 200 even though there's an issue
            if (error.response.status === 200) {
                return {
                    status: "200",
                    message: "Item removed from cart",
                    data: null
                };
            }
            
            throw new Error(`Server error: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received from server');
        } else {
            // Something happened in setting up the request
            throw new Error(`Request error: ${error.message}`);
        }
    }
}

/**
 * API to create a new order from cart items
 */
export const createOrderApi = async (itemIds: string[], accessToken: string): Promise<any> => {
  console.log("[API] createOrderApi - Starting with itemIds:", itemIds);
  try {
    // Format the request body according to the API requirements
    const requestBody = {
      items: itemIds.map(itemId => ({ itemId }))
    };
    
    console.log("[API] createOrderApi - Request body:", JSON.stringify(requestBody));
    console.log("[API] createOrderApi - Using token:", accessToken ? `${accessToken.substring(0, 10)}...` : 'No token');
    
    const response = await rootApi.post(`/order/create-order`, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });
    console.log("[API] createOrderApi - Response status:", response.status);
    console.log("[API] createOrderApi - Response data:", JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.error("[API] createOrderApi - Error:", error);
    if (error.response) {
      console.error("[API] createOrderApi - Response data:", error.response.data);
      console.error("[API] createOrderApi - Response status:", error.response.status);
      throw new Error(`Server error: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      console.error("[API] createOrderApi - Request sent but no response received");
      throw new Error('No response received from server');
    } else {
      console.error("[API] createOrderApi - Request setup error");
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

/**
 * API to create payment for an order
 * Returns payment information including checkout URL and QR code 
 */
export const createPaymentApi = async (orderCode: string, accessToken: string): Promise<any> => {
  console.log("[API] createPaymentApi - Starting with orderCode:", orderCode);
  try {
    const response = await rootApi.post(`/payment`, 
      { orderCode },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'accept': 'text/plain',
        }
      }
    );

    console.log("[API] createPaymentApi - Response status:", response.status);
    console.log("[API] createPaymentApi - Response data:", JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.error("[API] createPaymentApi - Error:", error);
    if (error.response) {
      console.error("[API] createPaymentApi - Response data:", error.response.data);
      console.error("[API] createPaymentApi - Response status:", error.response.status);
      throw new Error(`Server error: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      console.error("[API] createPaymentApi - Request sent but no response received");
      throw new Error('No response received from server');
    } else {
      console.error("[API] createPaymentApi - Request setup error");
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

/**
 * API to handle payment return from VNPAY
 */
// export const getPaymentReturnApi = async (queryParams: string, accessToken: string): Promise<any> => {
//   console.log("getPaymentReturnApi called with queryParams:", queryParams);
  
//   try {
//     // Make sure we're using the full URL with the baseURL from rootApi
//     const url = `/payment/return-payment?${queryParams}`;
//     console.log("Payment return API full URL:", `${rootApi.defaults.baseURL}payment/return-payment?${queryParams}`);
    
//     const response = await rootApi.get(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         accept: 'application/json',
//       }
//     });
    
//     console.log("getPaymentReturnApi response status:", response.status);
//     console.log("getPaymentReturnApi response data:", response.data);
    
//     return response.data;
//   } catch (error: any) {
//     console.error("Error processing payment return:", error);
    
//     if (error.response) {
//       console.error("Response status:", error.response.status);
//       console.error("Response data:", error.response.data);
//       console.error("Response headers:", error.response.headers);
//     } else if (error.request) {
//       console.error("No response received. Request details:", error.request);
//     }
    
//     throw new Error(
//       error.response?.data?.message || 
//       error.message || 
//       'Unknown error processing payment return'
//     );
//   }
// };

// export const getPaymentReturnApi = async (queryString: string, accessToken: string) => {
//   try {
//     console.log('[API] getPaymentReturnApi - Starting with query string:', queryString);
//     console.log('[API] getPaymentReturnApi - URL being called:', `/payment/return-payment?${queryString}`);
//     console.log('[API] getPaymentReturnApi - Using token:', accessToken ? `${accessToken.substring(0, 10)}...` : 'No token');
    
//     const response = await rootApi.get(`/payment/return-payment?${queryString}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         accept: 'application/json',
//       },
//       timeout: 10000,
//     });

//     console.log('[API] getPaymentReturnApi - Response status:', response.status);
//     console.log('[API] getPaymentReturnApi - Response data:', JSON.stringify(response.data));
    
//     if (!response.data) {
//       console.error('[API] getPaymentReturnApi - Invalid response structure');
//       throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
//     }

//     return response.data;
//   } catch (error) {
//     const errorDetails = {
//       message: error instanceof Error ? error.message : 'Unknown error',
//       response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
//       status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
//     };
//     console.error('[API] getPaymentReturnApi - Error details:', JSON.stringify(errorDetails));
    
//     if (error instanceof Error && 'response' in error) {
//       console.error('[API] getPaymentReturnApi - Response headers:', (error as any).response?.headers);
//       console.error('[API] getPaymentReturnApi - Response config:', (error as any).response?.config);
//     }
    
//     throw new Error(
//       error instanceof Error
//         ? `Failed to get payment return: ${error.message}`
//         : 'Failed to get payment return: Unknown error'
//     );
//   }
// };

export const paymentReturnApi = async (request: ReturnPaymentRequest, accessToken: string): Promise<any> => {
  console.log('paymentReturnApi called with request:', request);
  
  try {
    // Ensure accessToken is provided
    if (!accessToken) {
      throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
    }

    // Convert the request object to query parameters for GET request
    const params = {
      code: request.code,
      id: request.id,
      cancel: request.cancel,
      status: request.status
    };

    const response = await rootApi.get('/payment-return', {
      params: params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });

    // Log response for debugging
    console.log('paymentReturnApi response:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('paymentReturnApi error:', error);
    
    // Handle detailed error logging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      throw new Error(`Server error: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      console.error('No response received from server');
      throw new Error('No response received from server');
    } else {
      console.error('Request setup error');
      throw new Error(`Request error: ${error.message}`);
    }
  } 
}