import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Main page layout — all the existing components together
function MainLayout() {
  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <h1 className='text-4xl font-bold text-orange-600'>Welcome to HackUTD's Devday!</h1>
    </div>
  );
}

//Backend Code
function App() {
  return (
    // AuthProvider must wrap everything so any component can call useAuth()
    <AuthProvider>
      {/* AppProvider must be inside AuthProvider so it can read currentUser */}
      <AppProvider>
        <Router>
          <Routes>
            <Route path='/' element={<MainLayout />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;