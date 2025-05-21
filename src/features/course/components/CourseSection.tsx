import React from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity } from 'react-native';
import CourseCard from './CourseCard';

interface Course {
  name: string;
  rating: number;
  duration: number;
  price: number;
  active?: boolean;
  lessons?: any[];
}

interface CourseSectionProps {
  title: string;
  courses: Course[];
  showBuyButton?: boolean;
  onCardPress?: (course: Course) => void; // Thêm prop để xử lý onPress
}

const CourseSection: React.FC<CourseSectionProps> = ({
  title,
  courses,
  showBuyButton = false,
  onCardPress,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {courses.map((course, index) => (
          <View key={index}>
            <TouchableOpacity onPress={() => onCardPress && onCardPress(course)}>
              <CourseCard
                name={course.name}
                rating={course.rating}
                duration={course.duration}
                price={course.price}
                showBuyButton={showBuyButton}
                onBuyPress={() => console.log(`Mua khóa học: ${course.name}`)}
                index={index}
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