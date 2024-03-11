import { createSlice } from '@reduxjs/toolkit';

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    inputValue: '',
    editIndex: null,
    editValue: ''
  },
  reducers: {
    addTask: (state) => {
      if (state.inputValue.trim() !== '') {
        state.tasks.push(state.inputValue);
        state.inputValue = '';
      }
    },
    deleteTask: (state, action) => {
      state.tasks.splice(action.payload, 1);
      
    },
    editTask: (state) => {
      if (state.editValue.trim() !== '') {
        state.tasks[state.editIndex] = state.editValue;
        state.editIndex = null;
        state.editValue = '';
      }
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
    },
    setEditValue: (state, action) => {
      state.editValue = action.payload;
    },
    setEditIndex: (state, action) => {
      state.editIndex = action.payload;
      state.editValue = state.tasks[action.payload];
    }
  }
});

export const { addTask, deleteTask, editTask, setInputValue, setEditValue, setEditIndex } = tasksSlice.actions;

export default tasksSlice.reducer;
