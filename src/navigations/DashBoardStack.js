import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashBoardScreen from '../screens/DashboardScreen';
import NotificationScreen from '../screens/NotificationScreen';
import WalletScreen from '../screens/WalletScreen';
import FAQScreen from '../screens/FAQScreen';
import AuthNavigator from './AuthNavigator';

const Stack = createStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashBoardScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
    </Stack.Navigator>
  );
};

export default DashboardStack;
