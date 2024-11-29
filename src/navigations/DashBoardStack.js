import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashBoardScreen from '../screens/DashboardScreen';
import NotificationScreen from '../screens/NotificationScreen';
import WalletScreen from '../screens/WalletScreen';

const Stack = createStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashBoardScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
    </Stack.Navigator>
  );
};

export default DashboardStack;
