import { Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate for redirection

import { AuthProvider } from './context/AuthContext';
import Login from './componenets/Login';
import Register from './componenets/Register';
import Home from './componenets/Home';
import Splashscreen from './componenets/Splashscreen';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/Splashscreen" />} /> {/* Redirect root to home */}
          <Route path="/Splashscreen" element={<Splashscreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
