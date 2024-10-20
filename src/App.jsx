import { Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate for redirection

import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Splashscreen from './pages/Splashscreen';
import VideoPage from './pages/VideoPage';
import Coachers from './pages/Coachers';

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
          <Route path='/Videopage' element={<VideoPage/>}/>
          <Route path ='/Coachers' element= {<Coachers/>}/>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
