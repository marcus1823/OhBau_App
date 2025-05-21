import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import CourseCardDetail from '../components/CourseCardDetail';

const CourseDetailScreen = ({ navigation, route }: any) => {
  const { course } = route.params;

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title={course.name}
        onBackButtonPress={() => navigation.goBack()}
      />

      {/* Danh sách lessons */}
      <ScrollView contentContainerStyle={styles.content}>
        {course.lessons && course.lessons.length > 0 ? (
          course.lessons.map((lesson: any, index: number) => (
            <TouchableOpacity
              key={lesson.id}
              onPress={() => navigation.navigate('CourseChapterScreen', { lesson, course })}
            >
              <CourseCardDetail
                title={lesson.title}
                duration={20} // Giả định thời lượng cố định
                active={course.active}
                index={index}
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noLessonsText}>
            Hiện tại chưa có khóa học con nào trong khóa học này.
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
  noLessonsText: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CourseDetailScreen;