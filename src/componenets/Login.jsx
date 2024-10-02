// src/components/Login.js
import { useState } from 'react';
import { login, googleSignIn } from './FirebaseAuth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
//import googleLogo from '../assets/Images/google.png';
import Google from '../assets/Images/index.js';
import images from '../assets/Images/index.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const handleSignUpClick = () => {
    navigate('/register'); // Navigate to signup page
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      Swal.fire({
        title: 'Success!',
        text: 'You have logged in successfully.',
        icon: 'success',
        confirmButtonText: 'Okay',
      });
      navigate('/home');
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      Swal.fire({
        title: 'Success!',
        text: 'You have logged in successfully with Google.',
        icon: 'success',
        confirmButtonText: 'Okay',
      });
      navigate('/home');
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-center " style={{ backgroundImage: "url('https://wallpapercave.com/wp/wp1852917.jpg')" }}>
    <div className="">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Login </h2>
        <p className='ml-10'>Don't have account ?<button className='ml-3 underline cursor-pointer ' onClick={ handleSignUpClick} >  Sign Up</button></p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-4 py-2 mt-6 mb-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100"
        >
           <img src={images.Google} alt="Google" className="w-6 h-6 mr-2" />
          Login with Google
        </button>
        <div className="flex items-center my-4">
      <hr className="flex-grow border-t border-gray-300" />
      <span className="mx-4 text-gray-500">OR</span>
      <hr className="flex-grow border-t border-gray-300" />
    </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white transition duration-200 bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        
      </div>
    </div>
    </div>
  );
};

export default Login;
