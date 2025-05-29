import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import ChapterMediaDetailCard from '../components/ChapterMediaDetailCard';
import ChapterContentDetailCard from '../components/ChapterContentDetailCard';
import { useQuery } from '@tanstack/react-query';
import { getChapterApi } from '../api/courseApi';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { useToast } from '../../../utils/toasts/useToast';

const ChapterDetailScreen = ({ navigation, route }: any) => {
  const { chapters, isPurchased } = route.params;
  const chapterId = chapters.id;

  const { showError } = useToast();

  const {
    data,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['chapterDetail', chapterId],
    queryFn: () => getChapterApi(chapterId),
    enabled: !!chapterId,
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return <LoadingOverlay visible={isPending} fullScreen={false} />;
  }

  if (isError) {
    showError('Không thể tải chi tiết chương. Vui lòng thử lại sau.');
    return null;
  }

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title={chapters.title}
        onBackButtonPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {isPurchased ? (
          data && Object.keys(data).length > 0 ? (
            <View style={styles.chapterContainer}>
              {/* Card hiển thị media */}
              <ChapterMediaDetailCard
                imageUrl={data.imageUrl}
                videoUrl={data.videoUrl}
              />
              <Text style={styles.chapterTitle}>{data.title || 'Không có tiêu đề'}</Text>

              {/* Card hiển thị nội dung HTML */}
              <ChapterContentDetailCard
                content={data.content || ''}
              />
            </View>
          ) : (
            <Text style={styles.noChapterText}>
              Hiện tại chưa có bài học nào trong chương này.
            </Text>
          )
        ) : (
          <Text style={styles.lockedText}>
            Vui lòng mua khóa học này để xem nội dung chi tiết.
          </Text>
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  chapterContainer: {
    marginBottom: 20,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textBlack,
    marginBottom: 10,
  },
  noChapterText: {
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

export default ChapterDetailScreen;