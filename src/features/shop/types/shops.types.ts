export interface GetCategoryRequest {
    page?: number;
    size?: number;
}

export interface GetProductCategoryResponse {
    id: string;
    name: string;
    description: string;
}

export interface GetProductCategoryBaseResponse {
    status: string;
    message: string;
    data: GetProductCategoryResponse[];
}


export interface GetProductCategoryResponsePaginate {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: GetProductCategoryResponse[];
}

export interface GetProductCategoryResponsePaginateBaseResponse {
    status: string;
    message: string;
    data: GetProductCategoryResponsePaginate[];
}

// Product

export interface GetProductRequest {
    page?: number;
    size?: number;
}

export interface GetProductByCategoryRequest {
    id: string;
    page?: number;
    size?: number;
}
export interface GetProductResponse {
    id: string;
    name?: string;
    description?: string;
    brand?: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
    ageRange?: string;
    image?: string;
    status?: string;
    productCategoryId: string;
}

export interface GetProductBaseResponse {
    status: string;
    message: string;
    data?: GetProductResponse;
}

export interface GetProductResponsePaginate {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: GetProductResponse[]
}

export interface GetProductResponsePaginateBaseResponse {
    status: string;
    message: string;
    data: GetProductResponsePaginate[];
}