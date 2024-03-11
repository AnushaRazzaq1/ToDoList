import React from 'react';
import { createRoot } from 'react-dom/client'; 
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './redux/tasksSlice';
import App from './App';

const store = configureStore({
  reducer: {
    tasks: tasksReducer
  }
});

// Replace ReactDOM.render with createRoot
const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
