import { useInfiniteQuery } from "@tanstack/react-query"
import { getProductApi } from "../api/shopApi"

export const useProductQuery = () => {
    return useInfiniteQuery({
        queryKey: ['products'],
        queryFn: ({ pageParam = 1 }) => {
            return getProductApi({
                page: pageParam,
                size: 10,
            })
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPageParam < lastPage.totalPages) {
                return lastPageParam + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    })
}