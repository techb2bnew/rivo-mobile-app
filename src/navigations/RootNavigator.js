import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import CustomSplashScreen from '../screens/splashscren';
import { navigationRef } from '../NavigationService';

const Stack = createStackNavigator();

const RootNavigator = ({ isLoggedIn, showSplash }) => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showSplash ? (
          <Stack.Screen name="Splash" component={CustomSplashScreen} />
        ) : isLoggedIn ? (
          <Stack.Screen name="MainApp" component={TabNavigator} />
        ) : (
          <Stack.Screen name="AuthStack">
            {props => <AuthNavigator {...props} screen="SignUp" />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
