import { useInfiniteQuery } from "@tanstack/react-query";
import { GetProductByCategoryRequest } from "../types/shops.types";
import { getProductByCategoryApi } from "../api/shopApi";

export const useProductByCategoryQuery = (request?: GetProductByCategoryRequest) => {
    return useInfiniteQuery({
        enabled: !!request?.id,
        queryKey: ['productsByCategory', request?.id],
        queryFn: ({ pageParam = 1 }) => {
            return getProductByCategoryApi({
                id: request?.id || '',
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
        refetchOnWindowFocus: true,
        initialPageParam: 1,
    })
}