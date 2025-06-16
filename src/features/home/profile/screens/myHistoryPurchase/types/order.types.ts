export interface Order {
    id: string;
    totalPrice: number;
    createdDate: string;
    paymentStatus: PaymentStatus;
    email: string;
    phone: string;
}

export type PaymentStatus = 'Paid' | 'Unpaid' | 'Pending' | 'Failed' | 'Refunded' | 'Cancelled';

export interface GetOrdersResponse {
    status: string;
    message: string;
    data: {
        size: number;
        page: number;
        total: number;
        totalPages: number;
        items: Order[];
    };
}

export interface OrderDetail {
    id: string;
    totalPrice: number;
    items: OrderItem[];
    createdDate: string;
    paymentStatus: PaymentStatus;
    shippingAddress?: string;
    customerName?: string;
    email: string;
    phone: string;
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
}