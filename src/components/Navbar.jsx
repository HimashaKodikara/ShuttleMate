import React from 'react';


const Navbar = () => {
    return (
        <nav className="p-4 bg-gray-800">
            <div className="container flex items-center justify-between mx-auto">
                <div className="pl-5 font-serif text-2xl text-white">Shuttlemate</div>
                <div className="hidden pr-5 space-x-4 md:flex">
                    <a href="Home" className="text-gray-300 hover:text-white">Home</a>
                    <a href="#" className="text-gray-300 hover:text-white">Videos</a>
                    <a href="#" className="text-gray-300 hover:text-white">Coachers</a>
                    <a href="#" className="text-gray-300 hover:text-white">Courts</a>
                    <a href="#" className="text-gray-300 hover:text-white">Shops</a>
                </div>
                <div className="md:hidden">
                    <button className="text-gray-300 hover:text-white" id="menu-btn">
                        &#9776; {/* Hamburger Icon */}
                    </button>
                </div>
            </div>
            <div className="hidden md:hidden" id="mobile-menu">
                <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Home</a>
                <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">About</a>
                <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Services</a>
                <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Contact</a>
            </div>
        </nav>
    );
};

export default Navbar;
