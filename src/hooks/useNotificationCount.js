import { useSelector } from 'react-redux';

const useNotificationCount = () => {
  return useSelector((state) => state.notifications.count);
};

export default useNotificationCount;
