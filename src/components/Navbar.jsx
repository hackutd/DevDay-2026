import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../firebase/auth';

const Navbar = () => {
  const [nav, setNav] = useState(false);

  // Backend Authentication Logic
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate('/login');
  }

  return (
    <div>

    </div>
  );
};

export default Navbar;