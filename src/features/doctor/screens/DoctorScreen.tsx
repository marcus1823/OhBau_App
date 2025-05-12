import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Gradients } from '../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import SortBy from '../components/SortBy';
import DoctorCard from '../components/DoctorCard';
import { useDoctor } from '../hooks/useDoctor.hook';
import { useLoading } from '../../../utils/loading/useLoading';
import { GetDoctorResponse, GetDoctorResponsePaginate } from '../types/doctor.type';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { debounce } from 'lodash';

const DoctorScreen = () => {
  const { getDoctors } = useDoctor();
  const { isContextLoading, showContextLoading, hideContextLoading } = useLoading();
  const [sortType, setSortType] = useState('Tăng');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterLoading, setIsFilterLoading] = useState(false); // Trạng thái loading khi thay đổi bộ lọc

  // Debounce để hạn chế gọi API liên tục
  const debouncedSortChange = useCallback(
    (newSortType: string, newFilters: string[]) => {
      setIsFilterLoading(true); // Hiển thị loading ngay khi thay đổi
      const debounced = debounce(() => {
        setSortType(newSortType);
        setSelectedFilters(newFilters);
        setIsFilterLoading(false); // Tắt loading sau khi debounce hoàn thành
      }, 500);
      debounced();
    },
    [setSortType, setSelectedFilters]
  );

  const handleSortChange = (newSortType: string, newFilters: string[]) => {
    debouncedSortChange(newSortType, newFilters);
  };

  const handleInfoPress = (id: string) => {
    console.log('Doctor ID pressed:', id);
  };

  // Sử dụng useInfiniteQuery để hỗ trợ infinite scroll
  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['doctors', sortType, selectedFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const request = {
        pageSize: 10,
        pageNumber: pageParam,
        doctorName: selectedFilters.length > 0 ? selectedFilters.join(',') : undefined,
      };
      showContextLoading('fetchDoctors'); // Hiển thị loading trước khi gọi API
      try {
        const response = await getDoctors.mutateAsync(request);
        return response;
      } finally {
        hideContextLoading('fetchDoctors'); // Tắt loading sau khi gọi API
      }
    },
    getNextPageParam: (lastPage: GetDoctorResponsePaginate) => {
      if (lastPage.page < lastPage.totalPage) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Lấy danh sách bác sĩ từ các trang, lọc bỏ undefined
  const doctors: GetDoctorResponse[] =
    data?.pages
      .flatMap((page) => page.items?.filter((item): item is GetDoctorResponse => !!item) || [])
      .filter((item): item is GetDoctorResponse => !!item) || [];

  // Xử lý khi lướt đến cuối danh sách
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Render item cho FlatList
  const renderItem = ({ item }: { item: GetDoctorResponse }) => (
    <DoctorCard
      id={item.id}
      fullName={item.fullName}
      avatar={item.avatar}
      major={item.major}
      address={item.address}
      onInfoPress={handleInfoPress}
    />
  );

  // Render footer khi đang tải thêm
  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Gradients.backgroundPrimary[0]} />
        </View>
      );
    }
    return null;
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Danh sách bác sĩ"
        disableBackButton={true}
        searchButton={true}
        onSearchButtonPress={() => console.log('Search button pressed')}
      />
      <View style={styles.sortBy}>
        <SortBy onSortChange={handleSortChange} />
      </View>

      <FlatList
        data={doctors}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        
        ListEmptyComponent={
          isLoading || isFetching ? (
            <Text style={styles.noDataText}>Đang tải...</Text>
          ) : error ? (
            <Text style={styles.noDataText}>
              Lỗi khi tải danh sách bác sĩ: {(error as Error).message}
            </Text>
          ) : (
            <Text style={styles.noDataText}>Không có bác sĩ nào để hiển thị.</Text>
          )
        }
      />
      <LoadingOverlay
        visible={isContextLoading('fetchDoctors') || isLoading || isFetching || isFilterLoading}
        fullScreen={false}
      />
    </LinearGradient>
  );
};

export default DoctorScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingTop: 20, paddingBottom: 100, paddingHorizontal: 10 },
  sortBy: { marginTop: 50 },
  noDataText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  footerLoader: { padding: 20, alignItems: 'center' },
});