import rootApi from "../../../apis/rootApi";
import {
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
 * https://ohbau.cloud/api/v1/doctor-slot/3c26ab90-01e2-47f6-882f-3da0d93ba57d/user?date=2025%2F04%2F25
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