import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationScreen from '../screens/NotificationScreen';
import WalletScreen from '../screens/WalletScreen';
import TierScreen from '../screens/TierScreen';

const Stack = createStackNavigator();

const TierStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tier" component={TierScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
    </Stack.Navigator>
  );
};

export default TierStack;
