import { TextStyle } from "react-native";

export const toastStyles = {
  successToast: {
    type: 'success',
    text1: 'THÀNH CÔNG',
    text2: 'Thao tác thành công.',
    visibilityTime: 4000,
    autoHide: true,
    position: 'top' as 'top', 
    topOffset: 70,
    text1Style: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4CAF50',
    } as TextStyle,
    text2Style: {
      fontSize: 12,
      color: '#333',
    } as TextStyle,
  },

  errorToast: {
    type: 'error',
    text1: 'Đã có lỗi xảy ra',
    text2: 'Đã có lỗi xảy ra.',
    visibilityTime: 4000,
    autoHide: true,
    position: 'top' as 'top', 
    topOffset: 70,
    text1Style: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#f44336',
    } as TextStyle,
    text2Style: {
      fontSize: 12,
      color: '#333',
    } as TextStyle,
  },
  warningToast: {
    type: 'warning',
    text1: 'CẢNH BÁO!!!',
    text2: 'Vui lòng kiểm tra lại.',
    visibilityTime: 4000,
    autoHide: true,
    position: 'top' as 'top', 
    topOffset: 70,
    text1Style: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FF3C00',
    } as TextStyle,
    text2Style: {
      fontSize: 12,
      color: '#333',
    } as TextStyle,
  },
  infoToast: {
    type: 'info',
    text1: 'THÔNG TIN',
    text2: 'Thông báo thông tin.',
    visibilityTime: 4000,
    autoHide: true,
    position: 'top' as 'top', 
    topOffset: 70,
    text1Style: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2196F3', // Màu cho thông báo thông tin
    } as TextStyle,
    text2Style: {
      fontSize: 12,
      color: '#333',
    } as TextStyle,
  },
};
