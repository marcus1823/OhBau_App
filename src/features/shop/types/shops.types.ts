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
    images?: {
        id: string;
        url: string;
    }[] | null;
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

// Cart Types
export interface CartItem {
  itemId: string;
  name: string;
  imageUrl: string;
  description: string;
  color: string;
  size: string;
  unitPrice: number;
}

export interface CartItemDetailed extends CartItem {
  brand: string;
  ageRange: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  cartId: string;
  cartItem: CartItem[];
  totalPrice: number;
  totalItem: number;
}

export interface CartItemsDetails {
  cartItems: CartItemDetailed[];
  totalPrice: number;
}

export interface GetCartItemsByAccountResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Cart[];
}

export interface GetCartItemsDetailsResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: CartItemsDetails[];
}

export interface CartBaseResponse {
  status: string;
  message: string;
  data: null;
}

export interface GetCartItemsByAccountBaseResponse {
  status: string;
  message: string;
  data: GetCartItemsByAccountResponse;
}

export interface GetCartItemsDetailsBaseResponse {
  status: string;
  message: string;
  data: GetCartItemsDetailsResponse;
}

export interface UpdateItemQuantityRequest {
  quantity: number;
}

// Order types
export interface CreateOrderResponse {
  status: string;
  message: string;
  data: {
    orderCode: string;
    orderItems: {
      name: string;
      price: number;
    }[];
    totalPrice: number;
  };
}

// Payment types
export interface CreatePaymentResponse {
  status: string;
  message: string;
  data: {
    bin: string;
    accountNumber: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    status: string;
    expiredAt: number;
    checkoutUrl: string;
    qrCode: string;
  };
}

export interface PaymentReturnResponse {
  status: string;
  message: string;
  data: {
    paymentId?: string;
    orderCode?: string;
    transactionId?: string;
    amount?: number;
    paymentDate?: string;
    success: boolean;
  };
}


export interface ReturnPaymentRequest {
  code: string;
  id: string;
  cancel: boolean;
  status: string;
}