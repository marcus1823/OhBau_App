import {
  GetDoctorRequest,
  
  GetDoctorByIdRequest,
} from '../types/doctor.type';
import { getDoctorApi, getDoctorByIdApi } from '../api/doctorApi';
import { useCreateQuery } from '../../../hooks/useCreateQuery';
import { QueryFunctionContext } from '@tanstack/react-query';

/**
 * Custom hook để lấy danh sách bác sĩ (phân trang)
 * @param request - Tham số yêu cầu (pageSize, pageNumber, doctorName)
 * @returns Kết quả query với data, isLoading, isError, v.v.
 */
export const useGetDoctors = (request: GetDoctorRequest) =>
  useCreateQuery(
    ['doctors', request.pageNumber, request.doctorName] as const,
    ({ queryKey }: QueryFunctionContext<readonly [string, number, string | undefined]>) => {
      const [, pageNumber, doctorName] = queryKey;
      return getDoctorApi({
        pageSize: request.pageSize,
        pageNumber: pageNumber,
        doctorName: doctorName,
      });
    },
    'Danh sách bác sĩ đã được lấy thành công!',
    'Đã xảy ra lỗi trong quá trình lấy danh sách bác sĩ'
  );

/**
 * Custom hook để lấy thông tin chi tiết bác sĩ theo ID
 * @param request - Tham số yêu cầu (doctorID)
 * @returns Kết quả query với data, isLoading, isError, v.v.
 */
export const useGetDoctorById = (request: GetDoctorByIdRequest) =>
  useCreateQuery(
    ['doctor', request.doctorID] as const,
    ({ queryKey }: QueryFunctionContext<readonly [string, string]>) => {
      const [, doctorID] = queryKey;
      return getDoctorByIdApi({ doctorID });
    },
    'Thông tin bác sĩ đã được lấy thành công!',
    'Đã xảy ra lỗi trong quá trình lấy thông tin bác sĩ'
  );
