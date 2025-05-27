import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import ChapterCard from '../components/ChapterCard';
import { useQuery } from '@tanstack/react-query';
import { getChaptersApi } from '../api/courseApi';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { useToast } from '../../../utils/toasts/useToast';
import { GetChaptersResponse, Chapter } from '../types/course.types';

const CourseChapterScreen = ({ navigation, route }: any) => {
  const { topic, course, isPurchased } = route.params;
  const topicId = topic.id;

  const { showError } = useToast();

  const { data: chapters, isLoading, isError } = useQuery<GetChaptersResponse, Error>({
    queryKey: ['chapters', topicId],
    queryFn: () => getChaptersApi({ topicId, pageSize: 10, pageNumber: 1 }),
    enabled: !!topicId,
    refetchOnWindowFocus: false,
  });
  console.log('CourseChapterScreen chapters:', chapters);

  if (isLoading) {
    return <LoadingOverlay visible={isLoading} fullScreen={false} />;
  }
  if (isError) {
    showError('Không thể tải danh sách chương. Vui lòng thử lại sau.');
    return null;
  }

  const handleChapterPress = (chapter: Chapter) => {
    console.log('Navigating to ChapterDetailScreen with chapter:', chapter);
    navigation.navigate('ChapterDetailScreen', { chapter, course });
  };

  const renderItem = ({ item, index }: { item: Chapter; index: number }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleChapterPress(item)}
    >
      <ChapterCard
        title={item.title}
        content={item.content}
        progress={0}
        index={index}
      />
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title={topic.title}
        onBackButtonPress={() => navigation.goBack()}
      />

      {/* Danh sách chương */}
      <FlatList
        data={chapters?.items || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          !isPurchased ? (
            <Text style={styles.lockedText}>
              Vui lòng mua khóa học này để xem nội dung chi tiết.
            </Text>
          ) : chapters?.items.length === 0 ? (
            <Text style={styles.noChaptersText}>
              Hiện tại chưa có chương nào trong bài học này.
            </Text>
          ) : null
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
  noChaptersText: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: 20,
  },
  lockedText: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CourseChapterScreen;