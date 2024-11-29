import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSplashScreen from './src/screens/splashscren';
import TabNavigator from './src/navigations/TabNavigator';
import AuthNavigator from './src/navigations/AuthNavigator';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo
import Toast from './src/components/Toast';

function App(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setToastMessage('No Internet Connection. Please check your internet connection.');
        setIsConnected(false);
        setToastVisible(true); 
      } else {
        setToastMessage('');
        setIsConnected(true);
        setToastVisible(false); 
      }

      if (!state.isConnected) {
        setTimeout(() => setToastVisible(false), 5000); 
      }
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        {showSplash ? (
          <CustomSplashScreen />
        ) : isLoggedIn ? (
          <TabNavigator />
        ) : (
          <AuthNavigator screen="SignUp" />
        )}
      </NavigationContainer>
      <Toast message={toastMessage} visible={toastVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
