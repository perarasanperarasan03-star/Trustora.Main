import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PostItem from './pages/PostItem';
import MyItems from './pages/MyItems';
import AdminPanel from './pages/AdminPanel';
import VerifyOtp from './pages/VerifyOtp';
import MapView from './pages/MapView';
import ContactSupport from './pages/ContactSupport';   // 👈 './pages/' add pannunga
import Profile from './pages/Profile';




function App() {
  const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

<Route path="/admin" element={token && role === 'ADMIN' ? <AdminPanel /> : <Navigate to="/home" />} />

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/post-item" element={token ? <PostItem /> : <Navigate to="/login" />} />
        <Route path="/my-items" element={token ? <MyItems /> : <Navigate to="/login" />} />
        <Route path="/admin" element={token ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="/map" element={token ? <MapView /> : <Navigate to="/login" />} />
        <Route path="/support" element={<ContactSupport />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

