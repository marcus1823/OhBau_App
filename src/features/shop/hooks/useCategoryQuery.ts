import { useInfiniteQuery } from "@tanstack/react-query"
import { getCategoryApi } from "../api/shopApi"

export const useCategoryQuery = () => {
    return useInfiniteQuery({
        queryKey: ['categories'],
        queryFn: ({ pageParam = 1 }) => {
            return getCategoryApi({
                page: pageParam,
                size: 10,

            })
        },
        getNextPageParam: (lastPage) => lastPage.totalPages ?? undefined,
        refetchOnWindowFocus: true,
        retry: 1,
        initialPageParam: 1,
    })
}