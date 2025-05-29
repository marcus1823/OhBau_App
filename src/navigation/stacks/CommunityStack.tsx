
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommunityStackParamList } from '../../types/navigation/navigation';
import CommunityScreen from '../../features/community/screens/CommunityScreen';
import withAuth from '../../components/hoc/withAuth';
import BlogDetailScreen from '../../features/community/screens/BlogDetailScreen';

const Stack = createNativeStackNavigator<CommunityStackParamList>();
const CommunityStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunityScreen" component={withAuth(CommunityScreen)} />
      <Stack.Screen name="BlogDetailScreen" component={withAuth(BlogDetailScreen)} />
    </Stack.Navigator>
  )
}

export default CommunityStack