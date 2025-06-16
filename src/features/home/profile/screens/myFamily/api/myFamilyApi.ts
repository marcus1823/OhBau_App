import rootApi from "../../../../../../apis/rootApi";
import { RegisterParentRequest, RegisterParentResponseBaseResponse } from "../../../../../auth/types/auth.types";
import { CreateFetusRequest, CreateFetusResponseBaseResponse, UpdateAccountRequest } from "../../../../types/family.type";

export const createParentRelationApi = async (request: RegisterParentRequest, accessToken: string):Promise<RegisterParentResponseBaseResponse> => {
    try {
        const response = await rootApi.post('/parent', request, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating parent relation:', error);
        throw error;
    }
}


export const createFetusApi = async (request: CreateFetusRequest, accessToken: string): Promise<CreateFetusResponseBaseResponse> => {
    try {
        const response = await rootApi.post('/fetus', request, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating fetus:', error);
        throw error;
    }
}


export const UpdateProfileApi = async (request: UpdateAccountRequest, accessToken: string): Promise<any> => {
    console.log('UpdateProfileApi called with request:', request, 'and accessToken:', accessToken);
    
    try {
        const response = await rootApi.put('/account', request, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}