import { useCallback, useState } from "react";
import { debounce } from 'lodash';
import { useQuery } from '@tanstack/react-query';
type SearchResult = {
    id: string; // Thay đổi kiểu dữ liệu của id thành string
    [key: string]: any; // Linh hoạt cho các loại thuộc tính khác nhau
};



// SearchFn là kiểu cho một hàm tìm kiếm:
// - Nhận đầu vào là một chuỗi query (người dùng nhập)
// - Trả về một Promise chứa object có mảng items kiểu T (kết quả tìm được)
type SearchFn<T> = (query: string) => Promise<{ items: T[] }>;



// Interface mô tả kết quả trả về từ custom hook dùng cho tính năng search
interface UseSearchResult<T> {
    // Chuỗi truy vấn hiện tại (query mà người dùng nhập)
    searchQuery: string;
  
    // Hàm để cập nhật chuỗi truy vấn mới (dùng khi người dùng gõ)
    setSearchQuery: (query: string) => void;
  
    // Mảng kết quả tìm kiếm, kiểu T là kiểu dữ liệu cụ thể (ví dụ: Doctor, Course, ...)
    results: T[];
  
    // Cờ boolean cho biết đang trong quá trình tìm kiếm hay không (dùng để hiển thị loading UI)
    isLoading: boolean;
  }
  

  export const useSearch = <T extends SearchResult>(searchFn: SearchFn<T>, enabled: boolean): UseSearchResult<T> => {
    // State để lưu trữ chuỗi truy vấn hiện tại
    const [searchQuery, setSearchQuery] = useState('');

    // Debounce tìm kiếm 
    const debouncedSearch = useCallback(
        (query: string) => {
          debounce((q: string) => {
            setSearchQuery(q);
          }, 300)(query);
        },
        []
      );


      const handleSearchInput = (text: string) => {
        debouncedSearch(text);
      }

      // Sử dụng useQuery để thực hiện tìm kiếm
      const { data, isLoading } = useQuery({
        queryKey: ['search', searchQuery],
        queryFn: async () => {
            if (!searchQuery) {return { items: [] };}
            return searchFn(searchQuery);
        },
        enabled: enabled && !!searchQuery, // Chỉ gọi API khi có searchQuery
        // refetchOnWindowFocus: false, // Không gọi lại khi chuyển tab
        // retry: false, // Không thử lại khi có lỗi
      });

      const results = data?.items || []; // Kết quả tìm kiếm, mặc định là mảng rỗng nếu không có dữ liệu

        return {
            searchQuery,
            setSearchQuery: handleSearchInput, // Trả về hàm để cập nhật chuỗi truy vấn
            results,
            isLoading,
        };
  }