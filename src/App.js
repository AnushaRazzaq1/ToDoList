import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TodoList from './components/TodoList';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />}
        />
        <Route
          path="/todo/*"
          element={
            isLoggedIn ? (
              <>
                <Header username={username} handleLogout={handleLogout} />
                <div className="content">
                  <TodoList />
                </div>
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

const Header = ({ username, handleLogout }) => (
  <div className="header">
    <div className="header-left">
      <UserOutlined className="user-icon" />
      <span className="username">{username}</span>
    </div>
    <div className="header-right">
      <LogoutOutlined className="logout-icon" onClick={handleLogout} />
    </div>
  </div>
);

export default App;
