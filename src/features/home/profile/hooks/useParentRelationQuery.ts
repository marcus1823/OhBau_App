import { useQuery } from "@tanstack/react-query"
import { getParentRelationApi } from "../../api/familyApi"

export const useParentRelationQuery = (accessToken: string) => {
    return useQuery({
        queryKey: ['parentRelation'],
        queryFn: () => getParentRelationApi(accessToken),
        enabled: !!accessToken,
    })
}

