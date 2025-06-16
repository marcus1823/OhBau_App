import {
  GetDoctorRequest,

  GetDoctorByIdRequest,
  CreateBookingRequest,
  CreateBookingResponse,
  FeedBackBookingResponse,
  FeedBackBookingRequest,
} from '../types/doctor.type';
import { createBookingApi, feedbackBookingApi, getDoctorApi, getDoctorByIdApi } from '../api/doctorApi';
import { useCreateQuery } from '../../../hooks/useCreateQuery';
import { QueryFunctionContext } from '@tanstack/react-query';
import { useCreateMutation } from '../../../hooks/useCreateMutation';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { useQueryClient } from '@tanstack/react-query';

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

/**
 * Custom hook để đặt lịch hẹn với bác sĩ
 * @returns Kết quả mutation với mutate, isLoading, isError, error, v.v.
 */
export const useBookingDoctor = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const queryClient = useQueryClient();
  console.log('accessToken in useBookingDoctor:', accessToken);
  

  return useCreateMutation<
    CreateBookingResponse,
    Error,
    CreateBookingRequest
  >(
    (request: CreateBookingRequest) => createBookingApi(request, accessToken!), // dấu ! ở sau accesstoken để đảm bảo không null
    'bookingDoctor',
    'Đặt lịch hẹn thành công!',
    'Đã xảy ra lỗi trong quá trình đặt lịch hẹn với bác sĩ',
    {
      onSuccess: () => {
        // Invalidate the myBookings query to ensure fresh data when navigating to MyAppointmentScreen
        queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      }
    }
  );
};

export const useFeedBackBooking = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return useCreateMutation<
    FeedBackBookingResponse,
    Error,
    FeedBackBookingRequest
    >(
      (request: FeedBackBookingRequest) => feedbackBookingApi(request, accessToken!),
      'feedbackBooking',
      'Phản hồi lịch hẹn thành công!',
      '',
      {
        onError: (error) => {
          console.log('Feedback Error:', error);
        }
      }
    )
}