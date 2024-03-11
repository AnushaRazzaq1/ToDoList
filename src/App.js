// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import TodoList from './components/TodoList';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/todo" element={isLoggedIn ? <TodoList /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
