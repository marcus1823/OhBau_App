

import { ParentRelationResponse } from '../types/family.type';
import rootApi from '../../../apis/rootApi';

export const getParentRelationApi = async (accessToken: string) => {
  try {
    const response = await rootApi.get<ParentRelationResponse>('/api/parent-relation', {
    
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.data) {
      throw new Error('Cấu trúc phản hồi không hợp lệ');
    }
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy thông tin quan hệ gia đình:', error);
    throw error;
  }
};
export const getFetusByCodeApi = async (code: string, accessToken: string) => {
    try {
        const response = await rootApi.get(`/fetus/code?code=${code}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.data) {
            throw new Error('Invalid response structure');
        }

        return response.data;
    } catch (error) {
        console.log('Error fetching fetus by code:', error);
        throw error;
    }
}