import React from 'react';
import { useNavigate } from 'react-router-dom';
import images from '../assets/Images/index.js'; // Ensure images.Bg points to a valid image path

const Splashscreen = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page
  };

  const handleSignUpClick = () => {
    navigate('/register'); // Navigate to signup page
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${images.Bg})` }} // Apply background image here
    >
      <div className="absolute inset-0 bg-black opacity-20"></div> 
      <div className="relative z-10 text-center text-white">
        <h1 className="mb-12 font-serif font-black text-9xl">Shuttlemate</h1>
        <div className="flex flex-col items-center">
          <button
            onClick={handleLoginClick}
            className="py-4 mb-8 font-serif text-4xl font-bold text-white bg-green-600 px-14 rounded-3xl hover:bg-green-500"
          >
            Login
          </button>
          <button
            onClick={handleSignUpClick}
            className="px-8 py-4 font-serif text-4xl font-bold text-white bg-green-500 rounded-3xl hover:bg-green-600"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Splashscreen;
