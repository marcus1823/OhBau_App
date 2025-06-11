import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShopStackParamList } from '../../types/navigation/navigation';
import ShopScreen from '../../features/shop/screens/ShopScreen';
import ProductDetailScreen from '../../features/shop/screens/ProductDetailScreen';

const Stack = createNativeStackNavigator<ShopStackParamList>();

const ShopStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopScreen" component={ShopScreen} />
      <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
    </Stack.Navigator>
  )
}

export default ShopStack