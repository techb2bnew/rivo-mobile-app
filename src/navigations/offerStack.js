import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OfferScreen from '../screens/OfferScreen';
import NotificationScreen from '../screens/NotificationScreen';
import WalletScreen from '../screens/WalletScreen';
import WebViewScreen from '../screens/WebViewScreen';
import AuthNavigator from './AuthNavigator';

const Stack = createStackNavigator();

const OfferStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OffersHome" component={OfferScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
       <Stack.Screen name="AuthNavigator" component={AuthNavigator} />

    </Stack.Navigator>
  );
};

export default OfferStack;
