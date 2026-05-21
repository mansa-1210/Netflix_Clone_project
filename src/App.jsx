import React, { useEffect, useState } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (!currentUser && location.pathname !== '/login') {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ background: '#000', height: '100vh' }} />;
  }

  return (
    <div>
      <ToastContainer theme='dark'/>
      <Routes>
        <Route path='/' element={user ? <Home/> : <Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/player/:id' element={user ? <Player/> : <Login/>}/>
      </Routes>
    </div>
  )
}

export default App
