import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';
import { debounce } from 'lodash';

interface SortByProps {
  // Hàm callback được gọi mỗi khi sort/filter thay đổi
  onSortChange?: (sortType: string, selectedFilters: string[]) => void;
}

/**
 * Component SortBy
 * 
 * Cho phép người dùng:
 * - Chọn kiểu sắp xếp ("A-Z" hoặc "Z-A")
 * - Chọn các filter như star, heart, female, male
 * - Callback `onSortChange` sẽ được gọi sau khi debounce để tránh spam request
 * - Có trạng thái `isLoading` tạm thời để disable các nút trong lúc xử lý
 */
const SortBy = ({ onSortChange }: SortByProps) => {
  const [sortType, setSortType] = useState('A-Z');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading tạm thời

  // Debounced callback để tránh gọi sort/filter quá nhanh
  const debouncedSortChange = useCallback(
    (newSortType: string, newFilters: string[]) => {
      setIsLoading(true);
      const debounced = debounce(() => {
        if (onSortChange) {
          onSortChange(newSortType, newFilters);
        }
        setIsLoading(false);
      }, 500);
      debounced();
    },
    [onSortChange]
  );

  // Toggle giữa 'A-Z' và 'Z-A', sau đó gọi debounce
  const handleSortToggle = () => {
    const newSortType = sortType === 'A-Z' ? 'Z-A' : 'A-Z';
    setSortType(newSortType);
    debouncedSortChange(newSortType, selectedFilters);
  };

  // Thêm hoặc gỡ filter khỏi danh sách, sau đó gọi debounce
  const handleFilterToggle = (filter: string) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter((f) => f !== filter)
      : [...selectedFilters, filter];
    setSelectedFilters(newFilters);
    debouncedSortChange(sortType, newFilters);
  };

  // Danh sách các filter có thể chọn
  const filters = [
    { name: 'star', label: 'Star', icon: 'star-outline', filledIcon: 'star', hasOutline: true },
    // { name: 'heart', label: 'Heart', icon: 'favorite-outline', filledIcon: 'favorite', hasOutline: true },
    { name: 'female', label: 'Female', icon: 'female', filledIcon: 'female', hasOutline: false },
    { name: 'male', label: 'Male', icon: 'male', filledIcon: 'male', hasOutline: false },
  ];

  return (
    <View style={styles.container}>
      {/* Nút toggle sắp xếp */}
      <TouchableOpacity style={styles.sortButton} onPress={handleSortToggle} disabled={isLoading}>
        <Text style={styles.sortText}>{sortType}</Text>
      </TouchableOpacity>

      {/* Danh sách các filter */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.name}
            style={[
              styles.filterButton,
              selectedFilters.includes(filter.name) && !filter.hasOutline
                ? styles.filterButtonSelected
                : null,
              isLoading && styles.disabledButton,
            ]}
            onPress={() => handleFilterToggle(filter.name)}
            disabled={isLoading}
          >
            <Icon
              name={selectedFilters.includes(filter.name) ? filter.filledIcon : filter.icon}
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SortBy;

// ------------------------------------------------------
// StyleSheet cho component SortBy
// ------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  sortButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  sortText: {
    fontSize: 16,
    color: Colors.textWhite,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    padding: 4,
    marginHorizontal: 4,
    backgroundColor: Colors.textLightGray,
    borderRadius: 16,
  },
  filterButtonSelected: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
