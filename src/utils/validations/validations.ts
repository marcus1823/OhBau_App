// Kiểm tra định dạng số điện thoại (giả định định dạng Việt Nam: bắt đầu bằng 0, 10 chữ số)
export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
};

// Kiểm tra định dạng email
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Kiểm tra trường bắt buộc (không được để trống)
export const validateRequired = (value: string | null | undefined, fieldName: string): string | null => {
    if (!value || value.trim() === '') {
        return `Vui lòng nhập ${fieldName}`;
    }
    return null;
};

// Kiểm tra ngày sinh (đảm bảo đã chọn và hợp lệ)
export const validateDateRequired = (date: Date | null, fieldName: string): string | null => {
    if (!date || isNaN(date.getTime())) {
        return `Vui lòng chọn ${fieldName}`;
    }
    return null;
};

// Kiểm tra ngày sinh không bắt buộc (chỉ kiểm tra tính hợp lệ nếu có)
export const validateDateOptional = (date: Date | null, fieldName: string): string | null => {
    if (date && isNaN(date.getTime())) {
        return `${fieldName} không hợp lệ`;
    }
    return null;
};

// Kiểm tra mật khẩu khớp
export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
        return 'Mật khẩu không khớp';
    }
    return null;
};

// Kiểm tra role (đảm bảo role không rỗng và hợp lệ)
export const validateRole = (role: string | null, fieldName: string): string | null => {
    if (!role || (role !== 'FATHER' && role !== 'MOTHER')) {
        return `Vui lòng chọn ${fieldName} (Bố hoặc Mẹ)`;
    }
    return null;
};

// Hàm chuyển đổi Date thành chuỗi định dạng YYYY-MM-DD
export const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};