import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../screens/SignUpScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const AuthNavigator = ({ screen }) => (
  <Stack.Navigator initialRouteName={screen} screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="TabNavigator" component={TabNavigator} />
  </Stack.Navigator>
);

export default AuthNavigator;
