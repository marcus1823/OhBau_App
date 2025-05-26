import rootApi from "../../../apis/rootApi";
import {
  CreateBookingRequest,
  CreateBookingResponse,
  CreateBookingResponseBaseResponse,
  GetDoctorByIdRequest,
  GetDoctorByIdResponse,
  GetDoctorByIdResponseBaseResponse,
  GetDoctorRequest,
  GetDoctorResponsePaginate,
  GetDoctorSlotForUserResponse,
  GetDoctorSlotForUserResponseBaseResponse,
  GetDoctorSlotRequest,
  GetDoctorsResponsePaginateBaseResponse,
} from "../types/doctor.type";

/**
 * Gọi API để lấy danh sách bác sĩ theo phân trang và tên (nếu có)
 * @param request - Chứa các tham số như pageSize, pageNumber, doctorName
 * @returns Danh sách bác sĩ được phân trang
 */
export const getDoctorApi = async (request: GetDoctorRequest): Promise<GetDoctorResponsePaginate> => {
  const { pageSize, pageNumber, doctorName } = request;

  // Tạo object params để truyền lên query string
  const params: Record<string, any> = { pageSize, pageNumber };
  if (doctorName) {
    params.doctorName = doctorName; // Thêm điều kiện lọc theo tên nếu có
  }

  // Gọi API GET để lấy danh sách bác sĩ
  const response = await rootApi.get<GetDoctorsResponsePaginateBaseResponse>('/doctor/get-doctors', { params });
console.log('API Response:', response.data.data); // Kiểm tra cấu trúc
  // Kiểm tra dữ liệu trả về có hợp lệ hay không
  if (!response.data?.data) {
    throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
  }

  return response.data.data;
};

/**
 * Gọi API để lấy thông tin chi tiết của 1 bác sĩ theo ID
 * @param request - Chứa doctorID của bác sĩ cần lấy thông tin
 * @returns Thông tin chi tiết của bác sĩ
 */
export const getDoctorByIdApi = async (request: GetDoctorByIdRequest): Promise<GetDoctorByIdResponse> => {
  const { doctorID } = request;
  console.log('req', request);
  

  // Gọi API GET với ID bác sĩ
  const response = await rootApi.get<GetDoctorByIdResponseBaseResponse>('/doctor/get-doctor-infor', {
    params: { doctorID },
  });

  // Kiểm tra dữ liệu trả về có hợp lệ hay không
  if (!response.data?.data) {
    throw new Error('Invalid response structure');
  }

  return response.data.data;
};


/**
 * Gọi API để lấy slot của bác sĩ theo ID và ngày
 * 
 */

export const getDoctorSlotApi = async (request: GetDoctorSlotRequest): Promise<GetDoctorSlotForUserResponse> => {
  const { doctorID, date } = request;
  console.log('getDoctorSlotApi req:', request);

  // Gọi API GET với ID bác sĩ và ngày
  const response = await rootApi.get<GetDoctorSlotForUserResponseBaseResponse>(`/doctor-slot/${doctorID}/user`, {
    params: { date },
  });

  // Kiểm tra dữ liệu trả về có hợp lệ hay không
  if (!response.data) {
    throw new Error('Invalid response structure');
  }

  return response.data.data;
}



/**
 * Gọi API để đặt lịch hẹn với bác sĩ
 * @param request - Tham số yêu cầu bao gồm doctorSlotId, bookingModule, description, date
 * @param accessToken - Token xác thực để gửi trong header
 * @returns Phản hồi từ API sau khi đặt lịch hẹn
 * @throws Error nếu yêu cầu thất bại hoặc phản hồi không hợp lệ
 */
export const createBookingApi = async (
  request: CreateBookingRequest,
  accessToken: string
): Promise<CreateBookingResponse> => {
  // Log yêu cầu để debug
  console.log('createBookingApi req:', request);
  console.log('accessToken in createBookingApi:', accessToken);

  // Kiểm tra accessToken
  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }

  try {
    // Log URL đầy đủ để kiểm tra
    console.log('Request URL:', `${rootApi.defaults.baseURL}booking`);
    
    // Gọi API POST để tạo lịch hẹn
    const response = await rootApi.post<CreateBookingResponseBaseResponse>(
      '/booking',
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: 'text/plain', // Thêm header accept để khớp với Swagger
          'Content-Type': 'application/json', // Đảm bảo Content-Type đúng
        },
      }
    );

    // Log phản hồi để debug
    console.log('createBookingApi res:', response);

    // Kiểm tra phản hồi có hợp lệ không
    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data.data;
  } catch (error) {
    // Xử lý lỗi chi tiết
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
      request: request, // Log thêm yêu cầu để dễ debug
    };
    console.error('createBookingApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to create booking: ${error.message}`
        : 'Failed to create booking: Unknown error'
    );
  }
};

/**
 * Get bookings for a user 
 * https://ohbau.cloud/api/v1/booking/user?page=1&size=10
 * @param accessToken - Token xác thực để gửi trong header
 */

export const getBookingsApi = async (
  request: { page: number; size: number },
  accessToken: string
) => {
  // Log yêu cầu để debug
  console.log('getBookingsApi req:', request);

  // Kiểm tra accessToken
  if (!accessToken) {
    throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
  }

  try {
    // Gọi API GET để lấy danh sách lịch hẹn của người dùng
    const response = await rootApi.get('/booking/user', {
      params: request,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'text/plain', // Thêm header accept để khớp với Swagger
      },
    });

    // Log phản hồi để debug
    console.log('getBookingsApi res:', response);

    // Kiểm tra phản hồi có hợp lệ không
    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data.data;
  } catch (error) {
    // Xử lý lỗi chi tiết
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
      request, // Log thêm yêu cầu để dễ debug
    };
    console.error('getBookingsApi error:', errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get bookings: ${error.message}`
        : 'Failed to get bookings: Unknown error'
    );
  }
};