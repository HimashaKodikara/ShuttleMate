import React from 'react';
import { useNavigate } from 'react-router-dom';


const Splashscreen = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page
  };

  const handleSignUpClick = () => {
    navigate('/register'); // Navigate to signup page
  };

  return (
    <div className="relative flex h-screen bg-center " style={{ backgroundImage: "url('https://wallpapercave.com/wp/wp1852917.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-20"></div> 
      <div className="relative z-10 mt-16 ml-12 text-white">
        <h1 className="mb-6 font-serif font-black text-9xl">Shuttlemate</h1>
        <div className="">
          <button
            onClick={handleLoginClick}
            className="px-4 py-4 mt-20 font-serif text-5xl font-bold text-white bg-green-600 ml-44 rounded-3xl hover:bg-green-500"
          >
            Login
          </button>
         
        </div>
        <button
            onClick={handleSignUpClick}
            className="px-4 py-4 mt-20 font-serif text-5xl font-bold text-white bg-green-500 ml-36 rounded-3xl hover:bg-green-600"
          >
            Sign Up
          </button>
      </div>
    </div>
  );
};

export default Splashscreen;
