import React, { useEffect } from 'react';
import './App.css';
import HomeScreen from './pages/HomeScreen';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Login from './pages/Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import ProfilePage from './pages/ProfilePage';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      userAuth => {
        if(userAuth) {
          dispatch(login({
            uid: userAuth.uid,
            email: userAuth.email,
          }));
        } else {
          dispatch(logout());
        }
      });
      // garbage cleaner
      return () => {
        unsubscribe();
      }
  }, [dispatch]);


  return (
    <div className="app">
      <Router>
      {!user ? (
        <Login />
      ) : (
        <Routes>
          <Route exact path='/' element={<HomeScreen />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Routes>
      )}
      </Router>
    </div>
  );
}

export default App;
