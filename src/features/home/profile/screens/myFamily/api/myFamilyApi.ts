import rootApi from "../../../../../../apis/rootApi";
import { RegisterParentRequest, RegisterParentResponseBaseResponse } from "../../../../../auth/types/auth.types";
import { CreateFetusRequest, CreateFetusResponseBaseResponse } from "../../../../types/family.type";

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
