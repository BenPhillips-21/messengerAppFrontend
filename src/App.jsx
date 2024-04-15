import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Navbar from './components/navbar';
import Home from './components/home';
import UserProfile from './components/userprofile';
import Register from './components/register';
import Login from './components/login';

function App() {
  const [JWT, setJWT] = useState(null);
  const location = useLocation();
  const showNavbar = !['/sign-up', '/login'].includes(location.pathname);

  return (
        <>
          {showNavbar && <Navbar JWT={JWT} setJWT={setJWT} />}
          <Routes>
            <Route path="/home" element={<Home JWT={JWT} setJWT={setJWT} />} />
            <Route path="/currentuser" element={<UserProfile JWT={JWT} setJWT={setJWT} />} />
            <Route path="/sign-up" element={<Register JWT={JWT} setJWT={setJWT} />} />
            <Route path="/login" element={<Login JWT={JWT} setJWT={setJWT} />} />
          </Routes>
        </>
      );
}

export default App;




