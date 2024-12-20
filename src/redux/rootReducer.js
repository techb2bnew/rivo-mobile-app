import { combineReducers } from 'redux';
import notificationReducer from './reducers';
import orderReducer from './orders/orderReducer';

const rootReducer = combineReducers({
  notifications: notificationReducer, 
  order: orderReducer
});

export default rootReducer;
