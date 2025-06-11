import { useMutation } from "@tanstack/react-query"
import {  RegisterParentRequest, RegisterParentResponseBaseResponse } from "../../../auth/types/auth.types"
import { createParentRelationApi } from "../screens/myFamily/api/myFamilyApi"

export const useCreateParentMutation = () => {
    return useMutation<
    RegisterParentResponseBaseResponse, 
    Error,
    {request: RegisterParentRequest, accessToken: string}
    >({
        mutationFn: ({ request, accessToken}) => 
            createParentRelationApi(request, accessToken),
    })
}
