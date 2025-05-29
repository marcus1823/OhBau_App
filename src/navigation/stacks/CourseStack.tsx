
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CourseStackParamList } from '../../types/navigation/navigation';
import CourseScreen from '../../features/course/screens/CourseScreen';
import CourseDetailScreen from '../../features/course/screens/CourseDetailScreen';
import CourseChapterScreen from '../../features/course/screens/CourseChapterScreen';
import ChapterDetailScreen from '../../features/course/screens/ChapterDetailScreen';


const Stack = createNativeStackNavigator<CourseStackParamList>();
const CourseStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CourseScreen" component={CourseScreen} />
      <Stack.Screen name="CourseDetailScreen" component={CourseDetailScreen} />
      <Stack.Screen name="CourseChapterScreen" component={CourseChapterScreen} />
      <Stack.Screen name="ChapterDetailScreen" component={ChapterDetailScreen} />

      {/* Profile Stack */}
      {/* <Stack.Screen name="ProfileStack" component={ProfileStack} /> */}

      

    </Stack.Navigator>
  )
}

export default CourseStack