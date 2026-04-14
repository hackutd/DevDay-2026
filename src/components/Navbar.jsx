import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../firebase/auth';
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose, AiFillTag } from 'react-icons/ai';
import { BsFillCartFill, BsFillSaveFill } from 'react-icons/bs';
import { TbTruckDelivery } from 'react-icons/tb'
import { FaUserFriends, FaWallet } from 'react-icons/fa'
import { MdFavorite, MdHelp } from 'react-icons/md'

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [favMenuOpen, setFavMenuOpen] = useState(false);
  const [cartMenuOpen, setCartMenuOpen] = useState(false);
  const { favorites, cart, removeFromCart, addToast } = useContext(AppContext);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate('/login');
  }

  // Form Validation States
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutCard, setCheckoutCard] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cardError, setCardError] = useState('');

  const handleCheckout = (e) => {
    e.preventDefault();
    setEmailError('');
    setCardError('');
    let isValid = true;

    if (!checkoutEmail.includes('@') || !checkoutEmail.includes('.')) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (checkoutCard.length < 16) {
      setCardError('Credit card must be 16 digits.');
      isValid = false;
    }

    if (isValid) {
      addToast('🎉 Mock Order Placed Successfully!');
      setCartMenuOpen(false);
      setCheckoutEmail('');
      setCheckoutCard('');
    }
  };

  return (
    <div className='max-w-[1640px] mx-auto flex justify-between items-center p-4'>
      {/* Left side */}
      <div className='flex items-center'>
        <div onClick={() => setNav(!nav)} className='cursor-pointer'>
          <AiOutlineMenu size={30} />
        </div>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl px-2'>
          Best <span className='font-bold'>Eats</span>
        </h1>
        <div className='hidden lg:flex items-center bg-gray-200 rounded-full p-1 text-[14px]'>
          <p className='bg-black text-white rounded-full p-2'>Delivery</p>
          <p className='p-2'>Pickup</p>
        </div>
      </div>

      {/* Search Input */}
      <div className='bg-gray-200 rounded-full flex items-center px-2 w-[200px] sm:w-[400px] lg:w-[500px]'>
        <AiOutlineSearch size={25} />
        <input
          className='bg-transparent p-2 w-full focus:outline-none'
          type='text'
          placeholder='Search foods'
        />
      </div>
      {/* Auth + Cart + Favorites buttons */}
      <div className='hidden md:flex gap-2 text-sm relative items-center'>
        <button
          onClick={() => setCartMenuOpen(true)}
          className='bg-black text-white flex items-center px-4 py-2 rounded-full hover:bg-gray-800 transition-colors relative'
        >
          <BsFillCartFill size={20} className='mr-2' /> Cart
          {cart.length > 0 && (
            <span className='absolute -top-1 -right-1 bg-orange-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold'>
              {cart.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setFavMenuOpen(!favMenuOpen)}
          className='border border-orange-600 text-orange-600 flex items-center px-4 py-2 rounded-full font-bold relative hover:bg-orange-100 transition-colors'
        >
          <MdFavorite size={20} className='mr-2' /> Favorites
          {favorites.length > 0 && (
            <span className='absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs'>
              {favorites.length}
            </span>
          )}
        </button>

        {/* Favorites Dropdown*/}
        {favMenuOpen && (
          <div className='absolute top-12 right-0 bg-white border border-gray-200 shadow-2xl rounded-xl w-[280px] p-4 z-50 flex flex-col gap-2 max-h-[400px] overflow-y-auto'>
            <h3 className='font-bold border-b pb-2 mb-2 text-orange-600 text-lg'>Your Favorites ❤️</h3>
            {favorites.length === 0 ? (
              <p className='text-sm text-gray-500 italic text-center py-4'>No favorites yet.<br />Click the heart on a food card to save it!</p>
            ) : (
              favorites.map((fav, i) => (
                <div key={i} className='flex items-center gap-3 border-b pb-2 last:border-b-0 group'>
                  <img src={fav.image} alt={fav.name} className='w-12 h-12 rounded-full object-cover shadow-sm' />
                  <div className='flex flex-col'>
                    <p className='text-sm font-bold text-gray-800 line-clamp-1' title={fav.name}>{fav.name}</p>
                    <p className='text-xs text-orange-600 font-bold'>{fav.price || '$$'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Login / Logout */}
        {currentUser ? (
          <div className='flex items-center gap-2 ml-2'>
            <span className='text-gray-500 text-xs hidden lg:block truncate max-w-[120px]'>{currentUser.email}</span>
            <button
              id='logout-btn'
              onClick={handleLogout}
              className='border border-gray-300 text-gray-600 px-3 py-2 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors'
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            id='login-btn'
            onClick={() => navigate('/login')}
            className='bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-700 transition-colors ml-2'
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {/* Overlay */}
      {nav ? <div className='bg-black/80 fixed w-full h-screen z-10 top-0 left-0'></div> : ''}


      {/* Side drawer menu */}
      <div className={nav ? 'fixed top-0 left-0 w-[300px] h-screen bg-white z-10 duration-300' : 'fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-300'}>
        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          className='absolute right-4 top-4 cursor-pointer'
        />
        <h2 className='text-2xl p-4'>
          Best <span className='font-bold'>Eats</span>
        </h2>
        <nav>
          <ul className='flex flex-col p-4 text-gray-800'>
            <li className='text-xl py-4 flex'><TbTruckDelivery size={25} className='mr-4' /> Orders</li>
            <li className='text-xl py-4 flex'><MdFavorite size={25} className='mr-4' /> Favorites</li>
            <li className='text-xl py-4 flex'><FaWallet size={25} className='mr-4' /> Wallet</li>
            <li className='text-xl py-4 flex'><MdHelp size={25} className='mr-4' /> Help</li>
            <li className='text-xl py-4 flex'><AiFillTag size={25} className='mr-4' /> Promotions</li>
            <li className='text-xl py-4 flex'><BsFillSaveFill size={25} className='mr-4' /> Best Ones</li>
            <li className='text-xl py-4 flex'><FaUserFriends size={25} className='mr-4' /> Invite Friends</li>
          </ul>
        </nav>
      </div>

      {/*]Cart Checkout*/}
      {cartMenuOpen && <div onClick={() => setCartMenuOpen(false)} className='bg-black/80 fixed w-full h-screen z-50 top-0 left-0 transition-opacity'></div>}

      <div className={cartMenuOpen ? 'fixed top-0 right-0 w-[100%] md:w-[400px] h-screen bg-white z-50 duration-300 p-6 overflow-y-auto shadow-2xl' : 'fixed top-0 right-[-100%] w-[100%] md:w-[400px] h-screen bg-white z-50 duration-300 p-6 shadow-2xl'}>
        <AiOutlineClose
          onClick={() => setCartMenuOpen(false)}
          size={30}
          className='absolute right-4 top-4 cursor-pointer hover:text-red-500 transition-colors'
        />
        <h2 className='text-2xl font-bold mb-6 mt-4'>Your <span className='text-orange-600'>Order</span></h2>

        {cart.length === 0 ? (
          <p className='text-gray-500 italic'>Your cart is empty.</p>
        ) : (
          <div className='flex flex-col gap-4 mb-8'>
            {/* Cart Items List */}
            {cart.map((item, index) => (
              <div key={index} className='flex items-center justify-between border-b pb-3'>
                <div className='flex items-center gap-3'>
                  <img src={item.image} alt={item.name} className='w-14 h-14 object-cover rounded shadow-sm' />
                  <p className='font-bold text-sm max-w-[140px] truncate' title={item.name}>{item.name}</p>
                </div>
                <div className='flex items-center gap-4'>
                  <p className='text-orange-600 font-bold text-sm'>{item.price || '$$'}</p>
                  <button onClick={() => removeFromCart(index)} className='p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold transition-colors'>Remove</button>
                </div>
              </div>
            ))}

            <div className='flex justify-between font-bold text-xl mt-4 bg-gray-50 p-4 rounded-lg'>
              <p>Total:</p>
              <p className='text-orange-600'>$$$</p>
            </div>

            {/* Mock Checkout Form*/}
            <h3 className='font-bold mt-6 mb-2 border-b pb-2'>Checkout Details</h3>
            <form onSubmit={handleCheckout} className='flex flex-col gap-3'>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className={`border w-full p-3 rounded focus:outline-none focus:ring-2 ${emailError ? 'border-red-500 ring-red-200' : 'focus:ring-orange-200 focus:border-orange-600'}`}
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                />
                {emailError && <p className='text-red-500 text-xs mt-1 font-bold'>{emailError}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Credit Card (16 Digits)"
                  className={`border w-full p-3 rounded focus:outline-none focus:ring-2 ${cardError ? 'border-red-500 ring-red-200' : 'focus:ring-orange-200 focus:border-orange-600'}`}
                  value={checkoutCard}
                  onChange={(e) => setCheckoutCard(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                  maxLength="16"
                />
                {cardError && <p className='text-red-500 text-xs mt-1 font-bold'>{cardError}</p>}
              </div>

              <button className='bg-orange-600 text-white font-bold text-lg py-4 rounded-lg mt-4 hover:bg-orange-700 transition-colors shadow-lg'>
                Complete Mock Order
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
