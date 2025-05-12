import {
    GetDoctorRequest,
    GetDoctorResponsePaginate,
    GetDoctorByIdRequest,
    GetDoctorByIdResponse,
  } from '../types/doctor.type';
  
  import { getDoctorApi, getDoctorByIdApi } from '../api/doctorApi';
  import { useCreateMutation } from '../../../hooks/useCreateMutation';
  
  // --------------------------------------------------------------------
  // Custom hook: useDoctor
  // Cung cấp các mutation liên quan đến bác sĩ (lấy danh sách & lấy theo ID)
  // --------------------------------------------------------------------
  
  export const useDoctor = () => {
    /**
     * Mutation: Lấy danh sách bác sĩ (phân trang)
     *
     * - mutationFn: gọi getDoctorApi
     * - context: 'fetchDoctors' (dùng cho loading context)
     * - successMessage: thông báo khi lấy dữ liệu thành công
     * - errorMessage: thông báo fallback khi có lỗi
     *
     * Dữ liệu đầu vào: GetDoctorRequest (pageSize, pageNumber, doctorName)
     * Dữ liệu trả về: GetDoctorResponsePaginate (list bác sĩ + meta)
     */
    const getDoctorsMutation = useCreateMutation<
      GetDoctorResponsePaginate,
      Error,
      GetDoctorRequest
    >(
      getDoctorApi,
      'fetchDoctors',
      'Danh sách bác sĩ đã được lấy thành công!',
      'Đã xảy ra lỗi trong quá trình lấy danh sách bác sĩ'
    );
  
    /**
     * Mutation: Lấy thông tin chi tiết của 1 bác sĩ theo ID
     *
     * - mutationFn: gọi getDoctorByIdApi
     * - context: 'fetchDoctorById'
     * - successMessage / errorMessage như trên
     *
     * Dữ liệu đầu vào: GetDoctorByIdRequest (doctorID)
     * Dữ liệu trả về: GetDoctorByIdResponse (thông tin chi tiết bác sĩ)
     */
    const getDoctorByIdMutation = useCreateMutation<
      GetDoctorByIdResponse,
      Error,
      GetDoctorByIdRequest
    >(
      getDoctorByIdApi,
      'fetchDoctorById',
      'Thông tin bác sĩ đã được lấy thành công!',
      'Đã xảy ra lỗi trong quá trình lấy thông tin bác sĩ'
    );
  
    // Trả về object chứa 2 mutation để dùng ở component
    return {
      getDoctors: getDoctorsMutation,
      getDoctorById: getDoctorByIdMutation,
    };
  };
  