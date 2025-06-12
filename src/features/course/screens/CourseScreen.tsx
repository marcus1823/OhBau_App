import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import SecondaryHeader from '../../../components/common/Header/SecondaryHeader';
import CourseSection from '../components/CourseSection';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { getCoursesApi, getMyCoursesApi } from '../api/courseApi';
import { GetCoursesRequest, GetCoursesResponse, GetMyCoursesRequest, GetMyCoursesResponse } from '../types/course.types';
import { useFetchFavoriteCourses } from '../hooks/useCourse.hook';

const CourseScreen = ({ navigation }: any) => {

  const [activeTab, setActiveTab] = useState<'all' | 'myCourses'>('all');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Fetch favorite courses on component mount
  const { isLoading: isLoadingFavorites } = useFetchFavoriteCourses();

  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    isFetching: isFetchingCourses,
    error: coursesError,
    fetchNextPage: fetchNextCoursesPage,
    hasNextPage: hasNextCoursesPage,
    isFetchingNextPage: isFetchingNextCoursesPage,
  } = useInfiniteQuery<GetCoursesResponse, Error>({
    queryKey: ['courses'],
    queryFn: async ({ pageParam = 1 }) => {
      const request: GetCoursesRequest = {
        pageSize: 10,
        pageNumber: pageParam as number,
      };
      return await getCoursesApi(request);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.items.length < lastPage.size) {
        return undefined;
      }
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
  console.log('CourseScreen - coursesData:', coursesData);


  const {
    data: myCoursesData,
    isLoading: isLoadingMyCourses,
    isFetching: isFetchingMyCourses,
    error: myCoursesError,
    fetchNextPage: fetchNextMyCoursesPage,
    hasNextPage: hasNextMyCoursesPage,
    isFetchingNextPage: isFetchingNextMyCoursesPage,
  } = useInfiniteQuery<GetMyCoursesResponse, Error>({
    queryKey: ['myCourses'],
    queryFn: async ({ pageParam = 1 }) => {
      const request: GetMyCoursesRequest = {
        pageSize: 10,
        pageNumber: pageParam as number,
      };
      if (!accessToken) {
        throw new Error('Access token not found. Please login again.');
      }
      return await getMyCoursesApi(request, accessToken);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.items.length < lastPage.size) {
        return undefined;
      }
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!accessToken,
  });

  console.log('CourseScreen - myCoursesData:', myCoursesData);

  const myCoursesIds = useMemo(
    () => myCoursesData?.pages.flatMap((page) => page.items.map((course) => course.id)) || [],
    [myCoursesData]
  );

  const courses = useMemo(
    () =>
      coursesData?.pages.flatMap((page) =>
        page.items.map((course) => ({
          ...course,
          isPurchased: myCoursesIds.includes(course.id),
        }))
      ) || [],
    [coursesData, myCoursesIds]
  );

  const myCoursesFromApi = useMemo(
    () => myCoursesData?.pages.flatMap((page) => page.items.map((course) => ({ ...course, isPurchased: true }))) || [],
    [myCoursesData]
  );

  const allCoursesFromApi = useMemo(
    () =>
      courses.reduce((acc, item) => {
        const category = item.category;
        const course = {
          courseId: item.id,
          name: item.name,
          rating: item.rating,
          duration: item.duration,
          isPurchased: item.isPurchased,
        };

        const existingCategory = acc.find((section: { title: any }) => section.title === category);
        if (existingCategory) {
          existingCategory.courses.push(course);
        } else {
          acc.push({ title: category, courses: [course] });
        }
        return acc;
      }, [] as { title: string; courses: { courseId: string; name: string; rating: number; duration: number; isPurchased: boolean }[] }[]),
    [courses]
  );

  const myCoursesGrouped = useMemo(
    () =>
      myCoursesFromApi.reduce((acc, item) => {
        const category = item.category;
        const course = {
          courseId: item.id,
          name: item.name,
          rating: item.rating,
          duration: item.duration,
          isPurchased: item.isPurchased,
        };

        const existingCategory = acc.find((section: { title: any }) => section.title === category);
        if (existingCategory) {
          existingCategory.courses.push(course);
        } else {
          acc.push({ title: category, courses: [course] });
        }
        return acc;
      }, [] as { title: string; courses: { courseId: string; name: string; rating: number; duration: number; isPurchased: boolean }[] }[]),
    [myCoursesFromApi]
  );

  const handleOpenNotificationModal = useCallback(() => {
    console.log('Open notification modal');
  }, []);

  const handleCardPress = useCallback(
    (course: any) => {
      navigation.navigate('CourseDetailScreen', {
        courseId: course.courseId,
        courseName: course.name,
        isPurchased: course.isPurchased,
      });
    },
    [navigation]
  );

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) { return; }

    setIsLoadingMore(true);
    if (activeTab === 'all' && hasNextCoursesPage && !isFetchingNextCoursesPage) {
      fetchNextCoursesPage();
    } else if (activeTab === 'myCourses' && hasNextMyCoursesPage && !isFetchingNextMyCoursesPage) {
      fetchNextMyCoursesPage();
    }

    setTimeout(() => setIsLoadingMore(false), 1000);
  }, [
    activeTab,
    hasNextCoursesPage,
    isFetchingNextCoursesPage,
    hasNextMyCoursesPage,
    isFetchingNextMyCoursesPage,
    fetchNextCoursesPage,
    fetchNextMyCoursesPage,
    isLoadingMore,
  ]);

  // Synchronize with route params if provided
  useEffect(() => {
    const tab = navigation.route?.params?.tab;
    if (tab === 'myCourses') {
      setActiveTab('myCourses');
    }
  }, [navigation.route?.params]);

  const renderItem = useCallback(
    ({ item }: { item: { title: string; courses: any[] } }) => (
      <CourseSection
        title={item.title}
        courses={item.courses}
        showBuyButton={activeTab === 'all'}
        onCardPress={handleCardPress}
        navigation={navigation}
      />
    ),
    [activeTab, handleCardPress, navigation]
  );

  const renderFooter = useCallback(() => {
    if (activeTab === 'all' && isFetchingNextCoursesPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      );
    } else if (activeTab === 'myCourses' && isFetchingNextMyCoursesPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      );
    } else if (
      (activeTab === 'all' && !hasNextCoursesPage && courses.length > 0) ||
      (activeTab === 'myCourses' && !hasNextMyCoursesPage && myCoursesFromApi.length > 0)
    ) {
      return <Text style={styles.noDataText}>Đã hết khoá học để xem rồi</Text>;
    }
    return null;
  }, [
    activeTab,
    isFetchingNextCoursesPage,
    isFetchingNextMyCoursesPage,
    hasNextCoursesPage,
    hasNextMyCoursesPage,
    courses.length,
    myCoursesFromApi.length,
  ]);

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <SecondaryHeader
        unreadMessages={5}
        unreadNotifications={3}
        onOpenNotificationModal={handleOpenNotificationModal}
      />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'all' && styles.activeTabButton]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Tất cả khóa học
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'myCourses' && styles.activeTabButton]}
          onPress={() => setActiveTab('myCourses')}
        >
          <Text style={[styles.tabText, activeTab === 'myCourses' && styles.activeTabText]}>
            Khóa học của tôi
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={activeTab === 'all' ? allCoursesFromApi : myCoursesGrouped}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        contentContainerStyle={styles.content}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          activeTab === 'all' ? (
            isLoadingCourses || isFetchingCourses ? (
              <Text style={styles.emptyMessage}>Đang tải...</Text>
            ) : coursesError instanceof Error ? (
              <Text style={styles.emptyMessage}>Lỗi: {coursesError.message}</Text>
            ) : (
              <Text style={styles.emptyMessage}>Không có khóa học nào!</Text>
            )
          ) : (
            // Tab "myCourses"
            !accessToken ? (
              <Text style={styles.emptyMessage}>Bạn cần phải đăng nhập mới xem được khóa học của bạn.</Text>
            ) : isLoadingMyCourses || isFetchingMyCourses ? (
              <Text style={styles.emptyMessage}>Đang tải...</Text>
            ) : myCoursesError instanceof Error ? (
              <Text style={styles.emptyMessage}>Lỗi: {myCoursesError.message}</Text>
            ) : (
              <Text style={styles.emptyMessage}>Bạn chưa thêm khóa học nào!</Text>
            )
          )
        }
      />
      <LoadingOverlay
        visible={isLoadingCourses || isFetchingCourses || isLoadingMyCourses || isFetchingMyCourses || isLoadingFavorites}
        fullScreen={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 30,
    paddingLeft: 15,
    paddingBottom: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: Colors.primary,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'regular',
    textAlign: 'center',
  },
  activeTabText: {
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  emptyMessage: {
    fontSize: 18,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: 20,
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
  },
});

export default CourseScreen;