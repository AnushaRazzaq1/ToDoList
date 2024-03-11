import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './redux/tasksSlice';

const store = configureStore({
  reducer: tasksReducer // Only one reducer, no need for combineReducers
});

export default store;
