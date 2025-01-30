import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import logo from './logo-zenner-regular.svg';
import backgroundImage from './background-img.jpg';
import SecondModal from './SecondModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const openModal = (signUp) => {
    setIsSignUp(signUp);
    setIsModalOpen(true);
    setError('');
  };

  const handleSignUp = () => {
    const { username, password, confirmPassword } = userDetails;
    if (!username || !password || !confirmPassword) {
      setError('All fields are required!');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    localStorage.setItem(
      'userCredentials',
      JSON.stringify({ username, password })
    );
    setIsModalOpen(false);
    setUserDetails({ username: '', password: '', confirmPassword: '' });
    setError('');
    alert('Sign-up successful! You can now log in.');
  };

  const handleLogin = () => {
    const { username, password } = loginDetails;
    const storedUser = JSON.parse(localStorage.getItem('userCredentials'));
    if (!username || !password) {
      setError('All fields are required!');
      return;
    }
    if (!storedUser) {
      setError('No user found. Please sign up first.');
      return;
    }
    if (storedUser.username === username && storedUser.password === password) {
      setError('');
      setIsModalOpen(false);
      setLoginDetails({ username: '', password: '' });
      navigate('/second-modal');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            className="App"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100vh',
            }}
          >
            <img src={logo} alt="Zenner Logo" className="logo" />
            <div className="login-container">
              <h2>Zenner International</h2>
              <button className="login-button" onClick={() => openModal(false)}>
                Login
              </button>
              <p className="switch-button" onClick={() => openModal(true)}>
                Not a User? Sign Up
              </p>
            </div>
            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h3>{isSignUp ? 'Sign Up' : 'Login'}</h3>
                  {error && <div className="error-message">{error}</div>}
                  {isSignUp ? (
                    <div className="login-form">
                      <div className="input-group">
                        <label>Username</label>
                        <input
                          type="text"
                          value={userDetails.username}
                          onChange={(e) =>
                            setUserDetails({ ...userDetails, username: e.target.value })
                          }
                          placeholder="Enter your username"
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label>Password</label>
                        <input
                          type="password"
                          value={userDetails.password}
                          onChange={(e) =>
                            setUserDetails({ ...userDetails, password: e.target.value })
                          }
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                          type="password"
                          value={userDetails.confirmPassword}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                      <button className="login-button" onClick={handleSignUp}>
                        Sign Up
                      </button>
                      <p className="switch-button" onClick={() => setIsSignUp(false)}>
                        Already a user? Login
                      </p>
                    </div>
                  ) : (
                    <div className="login-form">
                      <div className="input-group">
                        <label>Username</label>
                        <input
                          type="text"
                          value={loginDetails.username}
                          onChange={(e) =>
                            setLoginDetails({ ...loginDetails, username: e.target.value })
                          }
                          placeholder="Enter your username"
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label>Password</label>
                        <input
                          type="password"
                          value={loginDetails.password}
                          onChange={(e) =>
                            setLoginDetails({ ...loginDetails, password: e.target.value })
                          }
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      <button className="login-button" onClick={handleLogin}>
                        Login
                      </button>
                      <p className="switch-button" onClick={() => setIsSignUp(true)}>
                        Not a user? Sign Up
                      </p>
                    </div>
                  )}
                  <button className="close-modal" onClick={() => setIsModalOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        }
      />
      <Route path="/second-modal" element={<SecondModal />} />
    </Routes>
  );
}

export default App;
