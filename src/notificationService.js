// notificationService.js
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

// Configure Push Notification


// Function to schedule notification
export const scheduleNotification = (title,message) => {
  PushNotification.localNotificationSchedule({
    channelId: "default-channel-id",  
    title: title, 
    message: message , 
    allowWhileIdle: true,
    date: new Date(Date.now() + 5 * 1000), 
  });
};

// Function to trigger notification immediately
export const triggerLocalNotification = (title, message) => {
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "default-channel-id", 
    vibrate: true, 
    vibration: 300, 

    /* iOS and Android Properties */
    title: title , 
    message: message , 
    playSound: true, 
    soundName: "default", 
  });
};



// export const scheduleNotification = () => {
//     PushNotification.localNotificationSchedule({
//       message: "This is a scheduled notification",
//       date: new Date(Date.now() + 5 * 1000),
//       title: "Scheduled Notification",
//       largeIcon: "ic_launcher", // Custom large icon
//       smallIcon: "ic_notification", // Custom small icon
//       color: "#FF0000", // Custom color
//       priority: "high", // Priority
//       vibrate: true, // Enable vibration
//     });
//   };