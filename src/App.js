import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HeadlineCards from './components/HeadlineCards'
import Food from './components/Food'
import Category from './components/Category'
import ToastContainer from './components/ToastContainer'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <div>
          <Navbar />
          <Hero />
          <HeadlineCards />
          <Food />
          <Category />
          <ToastContainer />
      </div>
    </AppProvider>
  );
}

export default App;
