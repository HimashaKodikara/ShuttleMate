import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login'); // Replace with your target route
  };

  return (
    <div>
      <button onClick={handleClick}>Go to New Page</button>
    </div>
  );
};

export default Home;
