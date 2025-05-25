import { useState } from 'react';

import { QueryFunctionContext } from '@tanstack/react-query';
import { useCreateQuery } from '../../hooks/useCreateQuery';

/**
 * Định nghĩa kiểu dữ liệu kết quả tìm kiếm
 */
type SearchResult = {
  id: string; // Mỗi kết quả phải có ID duy nhất
  [key: string]: any; // Các thuộc tính khác linh hoạt
};

/**
 * Định nghĩa kiểu hàm tìm kiếm
 */
type SearchFn<T> = (query: string) => Promise<{ items: T[] }>;

/**
 * Kết quả trả về từ hook useSearch
 */
interface UseSearchResult<T> {
  searchQuery: string; // Từ khóa tìm kiếm hiện tại
  setSearchQuery: (query: string) => void; // Hàm cập nhật từ khóa
  results: T[]; // Danh sách kết quả tìm kiếm
  isLoading: boolean; // Trạng thái loading
}

/**
 * Custom hook để thực hiện tìm kiếm với debounce và caching bằng useCreateQuery
 *
 * @template T - Kiểu dữ liệu của kết quả tìm kiếm (phải có id)
 * @param searchFn - Hàm async nhận query string và trả về danh sách item
 * @param enabled - Cờ boolean để kích hoạt query
 * @returns searchQuery, setSearchQuery, results, isLoading
 */
export const useSearch = <T extends SearchResult>(
  searchFn: SearchFn<T>,
  enabled: boolean
): UseSearchResult<T> => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useCreateQuery(
    ['search', searchQuery] as const,
    async ({ queryKey }: QueryFunctionContext<readonly [string, string]>) => {
      const [, query] = queryKey;
      if (!query) {
        return { items: [] };
      }
      return searchFn(query);
    },
    '',
    'Lỗi khi tìm kiếm',
    {
      enabled: enabled && !!searchQuery, // Chỉ chạy query khi enabled và có từ khóa
    }
  );

  const results = data?.items || [];

  return {
    searchQuery,
    setSearchQuery,
    results,
    isLoading,
  };
};