import { useCreateMutation } from '../../../hooks/useCreateMutation';
import { uploadImageApi } from '../api/blogApi';

interface UploadImageRequest {
  image: FormData;
  accessToken: string;
}

export const useUploadImage = () => {
  return useCreateMutation<string, Error, UploadImageRequest>(
    ({ image, accessToken }) => uploadImageApi(image, accessToken),
    'uploadImage',
    'Tải ảnh lên thành công!',
    'Đã xảy ra lỗi khi tải ảnh lên'
  );
};