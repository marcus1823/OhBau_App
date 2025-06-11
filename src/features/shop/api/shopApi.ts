import rootApi from "../../../apis/rootApi";
import { GetCategoryRequest, GetProductBaseResponse, GetProductByCategoryRequest, GetProductCategoryResponsePaginate, GetProductRequest, GetProductResponsePaginate,  } from "../types/shops.types";


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