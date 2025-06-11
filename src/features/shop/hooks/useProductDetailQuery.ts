import { useQuery } from "@tanstack/react-query"
import { getProductByIdApi } from "../api/shopApi"

export const useProductDetailQuery = (id: string) => {
    return useQuery({
        queryKey: ['productDetail', id],
        queryFn: () => {
            return getProductByIdApi(id)
        }
    })
}