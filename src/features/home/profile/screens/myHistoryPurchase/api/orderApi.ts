import rootApi from "../../../../../../apis/rootApi";
import { GetOrdersResponse } from "../types/order.types";


export const getOrdersApi = async (pageNumber: number, pageSize: number, accessToken: string): Promise<GetOrdersResponse> => {
  try {
    const response = await rootApi.get(`/order/get-orders`, {
        params: {
            pageNumber,
            pageSize,
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
  } catch (error: any) {
    // Enhanced error handling
    const errorMessage = error.response?.data?.message || 'Lỗi khi tải lịch sử mua hàng';
    console.error('Order API Error:', errorMessage, error);
    throw new Error(errorMessage);
  }
};