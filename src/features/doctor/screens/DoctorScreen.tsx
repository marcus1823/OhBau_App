import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Gradients } from '../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import SortBy from '../components/SortBy';
import DoctorCard from '../components/DoctorCard';
import SearchModal from '../components/SearchModal';
import {
  GetDoctorResponse,
  GetDoctorResponsePaginate,
} from '../types/doctor.type';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { debounce } from 'lodash';
import { getDoctorApi } from '../api/doctorApi';

const DoctorScreen = ({ navigation }: any) => {
  // const { getDoctors } = useDoctor();
  const [sortType, setSortType] = useState('A-Z');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);  // ✅ State để điều khiển modal tìm kiếm

  // ✅ Tạo debounce chỉ một lần duy nhất, dùng useRef để giữ lại hàm
  const debounceRef = useRef<
    (newSortType: string, newFilters: string[]) => void
  >(undefined);

  useEffect(() => {
    debounceRef.current = debounce(
      (newSortType: string, newFilters: string[]) => {
        setSortType(newSortType);
        setSelectedFilters(newFilters);
        setIsFilterLoading(false);
      },
      500
    );
  }, []);

  const handleSortChange = (newSortType: string, newFilters: string[]) => {
    setIsFilterLoading(true);
    debounceRef.current?.(newSortType, newFilters);
  };

  const handleInfoPress = (id: string) => {
    console.log('Doctor ID pressed:', id);
    setIsSearchModalVisible(false);
    navigation.navigate('DoctorDetailScreen', {
      id,
    });
  };

  const handleSearchButtonPress = () => {
    setIsSearchModalVisible(true);
  };

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
        doctorName:
          selectedFilters.length > 0
            ? selectedFilters.join(',')
            : undefined,
      };
      try {
        // const response = await getDoctors.mutateAsync(request);
        const response = await getDoctorApi(request);
        return response;
      } finally {
      }
    },
    getNextPageParam: (lastPage: GetDoctorResponsePaginate) => {
      console.log('Last Page:', lastPage); // In log để kiểm tra
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
  console.log('Query States:', { isLoading, isFetching, isFetchingNextPage, hasNextPage });

  // ✅ Lọc danh sách bác sĩ
  // const doctors = useMemo(
  //   () =>
  //     data?.pages
  //       .flatMap((page) => page.items?.filter((item): item is GetDoctorResponse => !!item) || [])
  //       .filter((item): item is GetDoctorResponse => !!item) || [],
  //   [data]
  // );
  
const doctors = useMemo(
  () => data?.pages.flatMap((page) => page.items || []) || [],
  [data]
);

  // ✅ Hàm load thêm trang
const handleLoadMore = () => {
  console.log('handleLoadMore called', { hasNextPage, isFetchingNextPage });
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};

  // ✅ Tối ưu renderItem bằng useCallback
  const renderItem = useCallback(
    ({ item }: { item: GetDoctorResponse }) => (
      <DoctorCard
        id={item.id}
        fullName={item.fullName}
        avatar={item.avatar}
        major={item.major}
        address={item.address}
        onInfoPress={handleInfoPress}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ✅ Hiển thị loading hoặc thông báo "đã hết dữ liệu"
const renderFooter = () => {
  console.log('Render Footer:', { isFetchingNextPage, hasNextPage, doctorsLength: doctors.length });
  if (isFetchingNextPage) {
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Gradients.backgroundPrimary[0]} />
      </View>
    );
  }
  if (!hasNextPage && doctors.length > 0) {
    return <Text style={styles.noDataText}>Bạn đã xem hết danh sách bác sĩ.</Text>;
  }
  return null;
};

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Danh sách bác sĩ"
        disableBackButton={true}
        searchButton={true}
        onSearchButtonPress={handleSearchButtonPress}
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
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading || isFetching ? (
            <Text style={styles.noDataText}>Đang tải...</Text>
          ) : error instanceof Error ? (
            <Text style={styles.noDataText}>Lỗi: {error.message}</Text>
          ) : (
            <Text style={styles.noDataText}>Không có bác sĩ nào để hiển thị.</Text>
          )
        }
      />

      <LoadingOverlay
        visible={
          // isContextLoading('fetchDoctors') ||
          isLoading ||
          isFetching ||
          isFilterLoading
        }
        fullScreen={false}
      />

      <SearchModal
        visible={isSearchModalVisible}
        onClose={() => setIsSearchModalVisible(false)}
        onInfoPress={handleInfoPress}
      />
    </LinearGradient>
  );
};

export default DoctorScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingTop: 20, paddingBottom: 20, paddingHorizontal: 10 },
  sortBy: { marginTop: 50 },
  noDataText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  footerLoader: { padding: 20, alignItems: 'center' },
});
