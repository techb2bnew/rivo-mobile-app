import PushNotification from 'react-native-push-notification';

const initialState = {
  notifications: [], // List of all notifications
  count: 0, // Unread notification count
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      // Check if the notification with the same identifier already exists
      const isDuplicate = state.notifications.some(
        (notification) => notification.identifier === action.payload.identifier
      );

      if (isDuplicate) {
        return state; // Don't add the notification if it's a duplicate
      }
      PushNotification.setApplicationIconBadgeNumber(state.count + 1);
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
        count: state.count + 1, // Increment count when a new notification is added
      };
      
    case 'RESET_NOTIFICATION_COUNT':
      PushNotification.setApplicationIconBadgeNumber(0);
      return {
        ...state,
        count: 0, // Reset count to 0 (e.g., when user views notifications)
      };
      
    default:
      return state;
  }
};

export default notificationReducer;


// PushNotification.setApplicationIconBadgeNumber(updatedNotifications.length);
