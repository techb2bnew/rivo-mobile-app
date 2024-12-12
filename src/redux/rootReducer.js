import { combineReducers } from 'redux';
import notificationReducer from './reducers';

const rootReducer = combineReducers({
  notifications: notificationReducer, 
});

export default rootReducer;
