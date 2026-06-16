import React from 'react';

const Hero = () => {
  return (
    <div className='max-w-[1640px] mx-auto p-4'>
      <div className = 'max-h-[500px] relative'>
        <div className = 'absolute w-full h-full text-gray-200 max-h-[500px] bg-black/40 flex flex-col justify-center'>
          <h1 className='px-4 text-4xl font-bold'>The <span className='text-orange-500'>Best</span>
          </h1>
          <h1 className='px-4 text-4xl font-bold'><span className='text-orange-500'>Foods</span> Delivered

          </h1>
        </div>
        <img className = 'w-full max-h-[500px] object-cover'
          src = 'https://th.bing.com/th/id/R.6fdface4471867ef989100efd8fafce5?rik=Ld9jNTpmZ4GVxA&riu=http%3a%2f%2fwww.pandaexpress.com.ph%2fsites%2fph%2ffiles%2fstyles%2fproduct_tile_2x%2fpublic%2f2023-03%2fBigger-Plate.jpg%3fitok%3dnI3V9fut&ehk=kpmINJDhjh75%2be2n7lPmKnH633CNKyrrGvari6hqm9s%3d&risl=&pid=ImgRaw&r=0'
          alt = '/'
        />
      </div>
    </div>
  );
};

export default Hero;