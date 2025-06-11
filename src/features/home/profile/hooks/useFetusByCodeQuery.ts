import { useQuery } from "@tanstack/react-query"
import { getFetusByCodeApi } from "../../api/familyApi"

export const useFetusByCodeQuery = (code: string, accessToken: string) => {
    return useQuery({
        queryKey: ['fetusByCode', code],
        queryFn: () => getFetusByCodeApi(code, accessToken),
        // enabled: !!code && !!accessToken,
        refetchOnWindowFocus: true,
        retry: 1,
    })
}