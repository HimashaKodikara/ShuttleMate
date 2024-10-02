// src/components/Register.js
import { useState } from "react";
import { register, signInWithGoogle } from "./FirebaseAuth";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import images from '../assets/Images/index.js';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const Back = () => {
    navigate('/splashscreen'); // Navigate to signup page
  };

  const handleloginclick = () => {
    navigate('/login'); // Navigate to signup page
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div  className="flex items-center justify-center h-screen bg-center bg-cover"
    style={{ backgroundImage: `url(${images.Bg})` }}>
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-xl">
        <img src={images.BackArrow} className='w-5 h-5 cursor-pointer' onClick={Back} />
        <h2 className="mb-6 text-3xl font-bold text-center uppercase">Create an account</h2>
        <p className='ml-20 '>Already have an account? <button className='ml-1 underline cursor-pointer hover:text-red-400' onClick={handleloginclick}>Sign In</button></p>

        <button
          onClick={handleGoogleRegister}
          className="flex items-center justify-center w-full px-4 py-2 mt-12 mb-6 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100"
        >
          <img src={images.Google} alt="Google" className="w-6 h-6 mr-2" />
          Sign Up with Google
        </button>
        <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-500">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          
        <form onSubmit={handleSubmit} className="space-y-4">
          <p>Enter your Email and Password to create an account</p>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white transition-colors bg-blue-500 rounded-2xl hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        
       
      </div>
    </div>
  );
};

export default Register;
