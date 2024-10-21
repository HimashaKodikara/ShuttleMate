import React from 'react';
import { Link } from 'react-router-dom';
import images from '../assets/Images/index.js';

const Home = () => {
  

  const cards = [
    { id: 1, title: 'Upload Video', image:images.player, link: '/Videopage' },
    { id: 2, title: 'Coachers', image: images.coach, link: '/Coachers' },
    { id: 3, title: 'Courts', image: images.court, link: '/card3' },
    { id: 4, title: 'Shops', image: images.Shops, link: '/card4' },
  ];

  return (
    <div className='h-screen bg-slate-950 '>
      <div className='flex flex-row items-center justify-center space-x-7'>
      <img src={images.logo} height={75} width={150}/>
      <h1 className='pt-10 font-serif font-black text-center text-white text-7xl'>Welcome to Shuttlemate</h1>
      </div>
      
      <p className='mt-12 text-3xl text-center text-white '>Select a option</p>
       <div className="grid grid-cols-1 gap-12 p-4 px-10 pt-14 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(card => (
        <Link key={card.id} to={card.link}>
          <div className="overflow-hidden bg-white rounded-lg shadow-md cursor-pointer">
            <img src={card.image} alt={card.title} className="object-cover w-full h-72" />
            <div className="p-4">
              <h3 className="text-lg font-bold text-center">{card.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
    </div>
  );
};

export default Home;
