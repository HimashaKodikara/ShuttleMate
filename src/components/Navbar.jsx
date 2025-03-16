import React from 'react';
import Video from '../pages/VideoPage';
import images from '../assets/Images';

const Navbar = () => {
    return (
        <nav className="p-1 bg-gray-800 shadow-sm shadow-white">
            <div className="container flex items-center justify-between ">
                <div className='flex flex-row items-center justify-center ml-10 space-x-16'><img src={images.logo} height={40} width={75}/>
                <div className="items-center font-serif text-2xl font-bold text-white ">Shuttlemate</div>
                </div>
                <div className="hidden pr-8 space-x-6 md:flex">
                    <a href="Home" className="text-gray-300 hover:text-white">Home</a>
                    <a href="VideoPage" className="text-gray-300 hover:text-white">Videos</a>
                    <a href="Coachers" className="text-gray-300 hover:text-white">Coachers</a>
                    <a href="Court" className="text-gray-300 hover:text-white">Courts</a>
                    <a href="shop" className="text-gray-300 hover:text-white">Shops</a>
                    <a href='Matchtimeline' className="text-gray-300 hover:text-white">Match Timeline</a>
                </div>
                
            </div>
            
        </nav>
    );
};

export default Navbar;
