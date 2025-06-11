

import { EditFetusBaseResponse, EditFetusDetailBaseResponse, EditFetusDetailRequest, EditFetusRequest, ParentRelationResponse } from '../types/family.type';
import rootApi from '../../../apis/rootApi';

export const getParentRelationApi = async (accessToken: string) => {
  try {
    const response = await rootApi.get<ParentRelationResponse>('/parent-relation', {
    
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

export const editFetusApi = async (id: string, accessToken: string, request: EditFetusRequest): Promise<EditFetusBaseResponse> => {
    try {
        const response = await rootApi.put<EditFetusBaseResponse>(`/fetus/${id}`, request, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.data) {
            throw new Error('Invalid response structure');
        }

        return response.data;
    } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('editFetusApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to edit fetus: ${error.message}` : 'Failed to edit fetus: Unknown error');
  }
}

export const editFetusDetailApi = async (id: string, accessToken: string, request: EditFetusDetailRequest): Promise<EditFetusDetailBaseResponse> => {
    try {
        const response = await rootApi.put<EditFetusDetailBaseResponse>(`/fetus/${id}/fetus-detail`, request, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.data) {
            throw new Error('Invalid response structure');
        }

        return response.data;
    } catch (error) {
        const errorDetails = {
            message: error instanceof Error ? error.message : 'Unknown error',
            response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
            status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
        };
        console.error('editFetusDetailApi error:', errorDetails);
        throw new Error(error instanceof Error ? `Failed to edit fetus detail: ${error.message}` : 'Failed to edit fetus detail: Unknown error');
    }
}