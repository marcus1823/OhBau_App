export interface Pagination {
  size: number;
  page: number;
  total: number;
  totalPages: number;
}

// Course Level
export interface Course {
  id: string;
  name: string;
  rating: number;
  duration: number;
  price: number;
  category: string;
  active: boolean;
  createAt: string;
  updateAt: string | null;
  deleteAt: string | null;
}

export interface GetCoursesRequest {
  pageSize?: number;
  pageNumber?: number;
  name?: string;
}

export interface GetCoursesResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Course[];
}

export interface GetMyCoursesRequest {
  pageSize?: number;
  pageNumber?: number;
  courseName?: string;
}

export interface GetMyCoursesResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Course[];
}

// Topic Level
export interface Topic {
  id: string;
  title: string;
  description: string;
  duration: number;
  isDelete: boolean;
}

export interface GetTopicsRequest {
  courseId: string;
  courseName?: string;
  pageSize?: number;
  pageNumber?: number ;
}

export interface GetTopicsResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Topic[];
}

// Chapter Level
export interface Chapter {
  id: string;
  image: string;
  title: string;
  content: string;
}

export interface GetChaptersRequest {
  topicId: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface GetChaptersResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Chapter[];
}

// Chapter Details Level
export interface ChapterDetails {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  imageUrl: string;
  course: string;
  active: boolean;
  createAt: string;
  updateAt: string | null;
  deleteAt: string | null;
}

export interface GetChapterRequest {
  chapterId: string;
}

export interface GetChapterResponse {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  imageUrl: string;
  course: string;
  active: boolean;
  createAt: string;
  updateAt: string | null;
  deleteAt: string | null;
}export interface Pagination {
  size: number;
  page: number;
  total: number;
  totalPages: number;
}

// Course Level
export interface Course {
  id: string;
  name: string;
  rating: number;
  duration: number;
  price: number;
  category: string;
  active: boolean;
  createAt: string;
  updateAt: string | null;
  deleteAt: string | null;
}

export interface GetCoursesRequest {
  pageSize?: number;
  pageNumber?: number;
  name?: string;
}

export interface GetCoursesResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Course[];
}

export interface GetMyCoursesRequest {
  pageSize?: number;
  pageNumber?: number;
  courseName?: string;
}

export interface GetMyCoursesResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Course[];
}

// Topic Level
export interface Topic {
  id: string;
  title: string;
  description: string;
  duration: number;
  isDelete: boolean;
}

export interface GetTopicsRequest {
  courseId: string;
  courseName?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface GetTopicsResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Topic[];
}

// Chapter Level
export interface Chapter {
  id: string;
  image: string;
  title: string;
  content: string;
}

export interface GetChaptersRequest {
  topicId: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface GetChaptersResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Chapter[];
}

// Chapter Details Level
export interface ChapterDetails {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  imageUrl: string;
  course: string;
  active: boolean;
  createAt: string;
  updateAt: string | null;
  deleteAt: string | null;
}

export interface GetChapterRequest {
  chapterId: string;
}

export interface GetChapterResponse {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  imageUrl: string;
  course: string;
  active: boolean;
  createAt: string;
  updateAt: string | null;
  deleteAt: string | null;
}

// Cart Level
export interface CartItemDetail {
  detailId: string;
  name: string;
  rating: number;
  duration: number;
  price: number;
}

export interface CartDetail {
  cartItems: CartItemDetail[];
  totalPrice: number;
}

export interface DeleteCartItemResponse {
  status: string;
  message: string;
  data: null;
}
export interface GetCartItemsDetailsResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: CartDetail[];
}

export interface CartItemByAccount {
  itemId: string;
  name: string;
  unitPrice: number;
}

export interface CartByAccount {
  cartId: string;
  cartItem: CartItemByAccount[];
  totalPrice: number;
}

export interface GetCartItemsByAccountResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: CartByAccount[];
}

// Order Level
export interface OrderItem {
  course: string;
  price: number;
}

export interface CreateOrderResponse {
  orderCode: string;
  orderItems: OrderItem[];
  totalPrice: number;
}