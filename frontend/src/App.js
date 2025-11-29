import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import EmployeeList from './components/EmployeeList';
import EmployeeAction from './components/EmployeeAction';
import EmployeeDetail from './components/EmployeeDetail';

const queryClient = new QueryClient();

// Simple Private Route Component wrapper
const Protected = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/employees" />} />
            
            <Route path="/employees" element={<Protected><EmployeeList /></Protected>} />
            <Route path="/employees/add" element={<Protected><EmployeeAction /></Protected>} />
            <Route path="/employees/edit/:id" element={<Protected><EmployeeAction /></Protected>} />
            <Route path="/employees/:id" element={<Protected><EmployeeDetail /></Protected>} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;