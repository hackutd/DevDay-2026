import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../firebase/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {//delete this section
      /*
      await loginUser(email, password);
      navigate('/'); // Success → go to main page*/
    } catch (err) {
      /* delete this section too
      setError('Invalid email or password. Please try again.');
      */
    }
    
    setLoading(false);
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white rounded-2xl shadow-xl p-10 w-full max-w-md'>

        {/* Header */}
        <h1 className='text-3xl font-bold text-center mb-2'>
          Best <span className='text-orange-600'>Eats</span>
        </h1>
        <p className='text-center text-gray-500 mb-8'>Sign in to save your favorites</p>

        {/* Error message */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm font-medium'>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className='flex flex-col gap-4'>
          <input
            id='login-email'
            type='email'
            placeholder='Email address'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent'
          />
          <input
            id='login-password'
            type='password'
            placeholder='Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent'
          />
          <button
            id='login-submit'
            type='submit'
            disabled={loading}
            className='bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 mt-2'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Link to register */}
        <p className='text-center text-gray-500 text-sm mt-6'>
          Don't have an account?{' '}
          <Link to='/register' className='text-orange-600 font-bold hover:underline'>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
