import React from 'react';

const HeadlineCards = () => {
  return (
    <div className='max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-3 gap-6'>
      {/* First Card */}
      <div className='rounded-xl relative'>
          {/* Overlay */}
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
          <p className='font-bold text-2xl px-2 pt-4'>Sun's Out, BOGO's Out</p>
          <p className='px-2'>Through 8/26</p>
          <button className='border-white bg-white text-black mx-2 absolute bottom-4'>Order Now</button>
        </div>
      <img className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl'
        src = 'https://images.unsplash.com/photo-1613769049987-b31b641f25b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
        alt = '/'
      />
      </div>
      {/* Second Card */}
      <div className='rounded-xl relative'>
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
          {/* Overlay */}
          <p className='font-bold text-2xl px-2 pt-4'>Spicy Chicken Sandwhich</p>
          <p className='px-2'>Through 9/25</p>
          <button className='border-white bg-white text-black mx-2 absolute bottom-4'>Order Now</button>
        </div>
        <img className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl'
        src = 'https://th.bing.com/th/id/OIP.oENz208yD0QFtuRZBAeiaQHaEK?w=285&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
        alt = '/'
      />
      </div>
      {/* Third Card */}
      <div className='rounded-xl relative'>
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
          {/* Overlay */}
          <p className='font-bold text-2xl px-2 pt-4'>Beef Patty</p>
          <p className='px-2'>Through 4/9</p>
          <button className='border-white bg-white text-black mx-2 absolute bottom-4'>Order Now</button>
        </div>
        <img className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl'
        src = 'https://chefbiting.com/wp-content/uploads/2025/12/3-6.webp'
        alt = '/'
      />
      </div>
    </div>
  );
};

export default HeadlineCards;
