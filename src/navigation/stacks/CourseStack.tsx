
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CourseStackParamList } from '../../types/navigation/navigation';
import CourseScreen from '../../features/course/screens/CourseScreen';

const Stack = createNativeStackNavigator<CourseStackParamList>();
const CourseStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CourseScreen" component={CourseScreen} />
    </Stack.Navigator>
  )
}

export default CourseStack