import React from 'react';
import Video from '../pages/VideoPage';

const Navbar = () => {
    return (
        <nav className="p-4 bg-gray-800 shadow-sm shadow-white">
            <div className="container flex items-center justify-between mx-auto">
                <div className="pl-5 font-serif text-2xl text-white">Shuttlemate</div>
                <div className="hidden pr-8 space-x-6 md:flex">
                    <a href="Home" className="text-gray-300 hover:text-white">Home</a>
                    <a href="VideoPage" className="text-gray-300 hover:text-white">Videos</a>
                    <a href="Coachers" className="text-gray-300 hover:text-white">Coachers</a>
                    <a href="Courts" className="text-gray-300 hover:text-white">Courts</a>
                    <a href="Shops" className="text-gray-300 hover:text-white">Shops</a>
                </div>
                
            </div>
            
        </nav>
    );
};

export default Navbar;
