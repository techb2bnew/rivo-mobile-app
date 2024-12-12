import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSplashScreen from './src/screens/splashscren';
import TabNavigator from './src/navigations/TabNavigator';
import AuthNavigator from './src/navigations/AuthNavigator';
import NetInfo from '@react-native-community/netinfo'; 
import Toast from './src/components/Toast';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { Provider} from 'react-redux';
import store from './src/redux/store';

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
    PushNotification.createChannel(
      {
        channelId: "default-channel-id",
        channelName: "Default Channel",
        channelDescription: "A default channel for notifications",
        soundName: "default",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Notification Channel Created: ${created}`)
    );
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('Notification:', notification);
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Function to get FCM token
    async function getFCMToken() {
      try {
        // Check if FCM token already exists in AsyncStorage
        const savedToken = await AsyncStorage.getItem('fcmToken');
        if (savedToken) {
          console.log('Using saved FCM Token:', savedToken);
        } else {
          // Request permission for notifications on iOS
          if (Platform.OS === 'ios') {
            await messaging().requestPermission();
          }

          // Get the FCM token and save it
          const token = await messaging().getToken();
          console.log('FCM Token:', token); 
          
          // Store the token in AsyncStorage for future use
          await AsyncStorage.setItem('fcmToken', token);
        }
      } catch (error) {
        console.error('Failed to get FCM token:', error);
      }
    }

    // Call the function to get the FCM token
    getFCMToken();

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
      <Provider store={store}>
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
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
