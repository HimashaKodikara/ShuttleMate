import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  

  return (
    <div>
      <h1 className=' bg-red-800'>Login Page</h1>
      <form >
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit"><Link to="/home">Login</Link></button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
