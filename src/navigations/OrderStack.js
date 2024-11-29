import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationScreen from '../screens/NotificationScreen';
import WalletScreen from '../screens/WalletScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';

const Stack = createStackNavigator();

const OrderStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Order" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
    </Stack.Navigator>
  );
};

export default OrderStack;