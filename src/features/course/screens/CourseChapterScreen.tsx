import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import ChapterCard from '../components/ChapterCard';

const CourseChapterScreen = ({ navigation, route }: any) => {
  const { lesson, course } = route.params;

  const handleChapterPress = (chapter: any) => {
    console.log('Navigating to ChapterDetailScreen with chapter:', chapter); 
    navigation.navigate('ChapterDetailScreen', { chapter, course });
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title={lesson.title}
        onBackButtonPress={() => navigation.goBack()}
      />

      {/* Danh sách chương */}
      <ScrollView contentContainerStyle={styles.content}>
        {course.active ? (
          lesson.chapters && lesson.chapters.length > 0 ? (
            lesson.chapters.map((chapter: any, index: number) => (
              <TouchableOpacity
                key={chapter.id}
                onPress={() => handleChapterPress(chapter)}
              >
                <ChapterCard
                  name={chapter.name}
                  description={chapter.description}
                  progress={chapter.progress}
                  index={index}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noChaptersText}>
              Hiện tại chưa có chương nào trong bài học này.
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