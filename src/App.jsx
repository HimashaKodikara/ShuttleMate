
import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Login from './componenets/Login';
import Register from './componenets/Register';
import Home from './componenets/Home';


function App() {
  return (
    <AuthProvider>
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </div>
  </AuthProvider>
  );
}

export default App;
