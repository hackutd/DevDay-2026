import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider }  from './contexts/AppContext';

import Navbar          from './components/Navbar';
import Hero            from './components/Hero';
import HeadlineCards   from './components/HeadlineCards';
import Food            from './components/Food';
import Category        from './components/Category';
import ToastContainer  from './components/ToastContainer';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';

// Main page layout — all the existing components together
function MainLayout() {
  return (
    <div>
      <Navbar />
      <Hero />
      <HeadlineCards />
      <Food />
      <Category />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    // AuthProvider must wrap everything so any component can call useAuth()
    <AuthProvider>
      {/* AppProvider must be inside AuthProvider so it can read currentUser */}
      <AppProvider>
        <Router>
          <Routes>
            <Route path='/'         element={<MainLayout />} />
            <Route path='/login'    element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
