import PushNotification from 'react-native-push-notification';

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
