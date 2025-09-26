// NavigationService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

export const navigationRef = createNavigationContainerRef();

export async function resetToAuthStack() {
  if (navigationRef.isReady()) {
    // Clear AsyncStorage
    await AsyncStorage.multiRemove(await AsyncStorage.getAllKeys());

    navigationRef.navigate("AuthNavigator")
    Toast.show("You’ve been logged out because your account was accessed from another device.")
  }
}

