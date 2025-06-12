import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import CourseCardDetail from '../components/CourseCardDetail';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getTopicsApi } from '../api/courseApi';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { useToast } from '../../../utils/toasts/useToast';
import {  Topic } from '../types/course.types';

const CourseDetailScreen = ({ navigation, route }: any) => {
  const { courseId, courseName, isPurchased } = route.params;
  console.log('CourseDetailScreen courseId:', courseId);
  console.log('CourseDetailScreen courseName:', courseName);
  console.log('CourseDetailScreen isPurchased:', isPurchased);

  const { showError } = useToast();

  const {
    data: topics,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['topics', courseId],
    queryFn: ({ pageParam = 1 }) =>
      getTopicsApi({
        courseId,
        pageSize: 10,
        pageNumber: pageParam,
      }), 
    getNextPageParam: ( lastPage ) => {
      const hasMore = lastPage.page < lastPage.totalPages;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1, // Start from page 1
    enabled: !!courseId,
  });
  
  console.log('CourseDetailScreen topics:', topics);

  if (isLoading) {
    return <LoadingOverlay visible={isLoading} fullScreen={false} />;
  }
  if (isError) {
    showError('Không thể tải danh sách bài học. Vui lòng thử lại sau.');
    return null;
  }

  const handleTopicPress = (item: Topic) => {
    navigation.navigate('CourseChapterScreen', { topic: item, course: { id: courseId, name: courseName }, isPurchased });
  };

  const renderItem = ({ item, index }: { item: Topic; index: number }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleTopicPress(item)}
    >
      <CourseCardDetail
        title={item.title}
        duration={item.duration || 0}
        isPurchased={isPurchased}
        index={index}
      />
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title={courseName}
        onBackButtonPress={() => navigation.goBack()}
      />
      <FlatList
        // data={topics?.items || []}
        data={topics?.pages.flatMap(page => page.items ?? []) || []} // để kết hợp các trang vì useInfiniteQuery trả về mảng các trang
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <Text style={styles.noLessonsText}>
            Hiện tại chưa có khóa học con nào trong khóa học này.
          </Text>
        }
        onEndReachedThreshold={0.5} // Ngưỡng để kích hoạt onEndReached là khi người dùng cuộn đến 50% cuối danh sách
        onEndReached={() => { // Kiểm tra nếu có trang tiếp theo và không đang trong quá trình lấy dữ liệu
          // nếu có trang tiếp theo và không đang lấy dữ liệu thì gọi fetchNextPage để lấy trang tiếp theo
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        ListFooterComponent={ // Hiển thị LoadingOverlay khi đang lấy dữ liệu trang tiếp theo
        
          isFetchingNextPage ? <LoadingOverlay visible={isFetchingNextPage} fullScreen={false} /> : null
        }
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
    paddingTop: 60,
    paddingHorizontal: 15,
    paddingBottom: 50,
  },
  noLessonsText: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CourseDetailScreen;