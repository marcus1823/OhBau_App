import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Định nghĩa kiểu dữ liệu kết quả tìm kiếm chung chung
type SearchResult = {
  id: string;                 // Mỗi kết quả phải có một ID duy nhất
  [key: string]: any;        // Các thuộc tính khác không giới hạn
};

// Định nghĩa kiểu hàm tìm kiếm
type SearchFn<T> = (query: string) => Promise<{ items: T[] }>;

// Kết quả trả về từ hook useSearch
interface UseSearchResult<T> {
  searchQuery: string;                 // Từ khóa người dùng đang tìm
  setSearchQuery: (query: string) => void; // Hàm cập nhật từ khóa tìm kiếm
  results: T[];                        // Danh sách kết quả tìm kiếm
  isLoading: boolean;                 // Trạng thái đang loading kết quả
}

/**
 * Custom hook để thực hiện tìm kiếm có debounce và caching bằng React Query.
 *
 * @param searchFn - Hàm async nhận query string và trả về danh sách item
 * @param enabled - Cờ boolean cho phép kích hoạt query
 * @returns searchQuery, setSearchQuery, results, isLoading
 */
export const useSearch = <T extends SearchResult>(
  searchFn: SearchFn<T>,
  enabled: boolean
): UseSearchResult<T> => {
  // State để lưu từ khóa tìm kiếm hiện tại
  const [searchQuery, setSearchQuery] = useState("");

  // Dùng useQuery để xử lý fetch và cache dữ liệu tìm kiếm
  const { data, isLoading } = useQuery({
    queryKey: ['search', searchQuery],      // Cache theo từ khóa tìm kiếm
    queryFn: async () => {
      // Nếu query rỗng thì trả về mảng rỗng, tránh gọi API không cần thiết
      if (!searchQuery) {
        return { items: [] };
      }

      // Gọi hàm tìm kiếm được truyền vào
      return searchFn(searchQuery);
    },
    enabled: enabled && !!searchQuery,       // Chỉ chạy query khi `enabled` là true và có từ khóa tìm
  });

  // Lấy danh sách kết quả từ data trả về
  const results = data?.items || [];

  // Trả về dữ liệu và setter cho component sử dụng hook này
  return {
    searchQuery,
    setSearchQuery,
    results,
    isLoading,
  };
};
