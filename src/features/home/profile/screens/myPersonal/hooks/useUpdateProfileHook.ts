import { useSelector } from "react-redux"
import { useCreateMutation } from "../../../../../../hooks/useCreateMutation"
import { RootState } from "../../../../../../stores/store"
import { UpdateAccountRequest } from "../../../../types/family.type"
import { UpdateProfileApi } from "../../myFamily/api/myFamilyApi"

export const useUpdateProfileHook = () => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken || '');
    return useCreateMutation<any, Error, UpdateAccountRequest>(
        (request) => {
            return UpdateProfileApi(request, accessToken);
        },
        'updateProfile',
        'Cập nhật thông tin thành công!',
        'Đã xảy ra lỗi trong quá trình cập nhật thông tin cá nhân'
    )
}