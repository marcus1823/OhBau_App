import React from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity } from 'react-native';
import CourseCard from './CourseCard';

interface Course {
  courseId: string;
  name: string;
  rating: number;
  duration: number;
  price: number;
  isPurchased: boolean;
}

interface CourseSectionProps {
  title: string;
  courses: Course[];
  showBuyButton?: boolean;
  onCardPress?: (course: Course) => void;
  navigation: any; // Thêm navigation prop
}

const CourseSection: React.FC<CourseSectionProps> = ({
  title,
  courses,
  showBuyButton = false,
  onCardPress,
  navigation,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {courses.map((course, index) => (
          <View key={index}>
            <TouchableOpacity onPress={() => onCardPress && onCardPress(course)}>
              <CourseCard
                courseId={course.courseId}
                name={course.name}
                rating={course.rating}
                duration={course.duration}
                price={course.price}
                isPurchased={course.isPurchased}
                showBuyButton={showBuyButton && !course.isPurchased}
                index={index}
                navigation={navigation} 
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 27,
    color: '#454545',
    marginBottom: 10,
    marginLeft: 5,
  },
});

export default CourseSection;