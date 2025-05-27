import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import CourseCardDetail from '../components/CourseCardDetail';
import { useQuery } from '@tanstack/react-query';
import { getTopicsApi } from '../api/courseApi';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { useToast } from '../../../utils/toasts/useToast';
import { GetTopicsResponse, Topic } from '../types/course.types';

const CourseDetailScreen = ({ navigation, route }: any) => {
  const { courseId, courseName, isPurchased } = route.params;
  console.log('CourseDetailScreen courseId:', courseId);
  console.log('CourseDetailScreen courseName:', courseName);
  console.log('CourseDetailScreen isPurchased:', isPurchased);

  const { showError, showInfo } = useToast();

  const { data: topics, isLoading, isError } = useQuery<GetTopicsResponse, Error>({
    queryKey: ['topics', courseId],
    queryFn: () => getTopicsApi({ courseId, pageSize: 10, pageNumber: 1 }),
    enabled: !!courseId,
    refetchOnWindowFocus: false,
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
    if (!isPurchased) {
      showInfo('Vui lòng mua khoá học để xem nội dung chi tiết.');
     
      return;
    }
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
        data={topics?.items || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <Text style={styles.noLessonsText}>
            Hiện tại chưa có khóa học con nào trong khóa học này.
          </Text>
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