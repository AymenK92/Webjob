import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './components/HomePage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Company from './components/Company';
import JobAdsPage from './components/JobAdsPage';
import Profile from './components/Profile';
import { DrawerProvider } from './DrawerContext';
import { login } from './services/authService';
import { AuthProvider } from './services/authContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <DrawerProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/company" element={<PrivateRoute><Company /></PrivateRoute>} />
            <Route path="/jobads" element={<PrivateRoute><JobAdsPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </DrawerProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
