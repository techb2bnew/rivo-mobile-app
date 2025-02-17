export const addNotification = (notification) => ({
  type: 'ADD_NOTIFICATION',
  payload: notification,
});

export const resetNotificationCount = () => ({
  type: 'RESET_NOTIFICATION_COUNT',
});

