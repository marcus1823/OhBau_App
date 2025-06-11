import { useMutation } from "@tanstack/react-query"
import { CreateFetusRequest, CreateFetusResponseBaseResponse } from "../../types/family.type"
import { createFetusApi } from "../screens/myFamily/api/myFamilyApi"

export const useCreateFetusMutation = () => {
    return useMutation<
    CreateFetusResponseBaseResponse,
    Error,
    { request: CreateFetusRequest, accessToken: string }
    >({
        mutationFn: ({ request, accessToken }) =>
            createFetusApi(request, accessToken),
    })
}