import PushNotification from 'react-native-push-notification';

const initialState = {
  notifications: [], // List of all notifications
  count: 0, // Unread notification count
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      console.log("Adding Notification with ID:", action.payload.identifier);

      // Check for duplicates before adding
      if (state.notifications.some(notification => notification.identifier === action.payload.identifier)) {
        console.log("Duplicate Notification, skipping:", action.payload.identifier);
        return state; // Prevent duplicate addition
      }

      PushNotification.setApplicationIconBadgeNumber(state.count + 1);

      return {
        ...state,
        notifications: [...state.notifications, action.payload],
        count: state.count + 1,
      };

    case 'RESET_NOTIFICATION_COUNT':
      PushNotification.setApplicationIconBadgeNumber(0);
      return {
        ...state,
        count: 0,
      };

    default:
      return state;
  }
};

export default notificationReducer;

// PushNotification.setApplicationIconBadgeNumber(updatedNotifications.length);
