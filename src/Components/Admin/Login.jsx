import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { authentication } from '../../firebase';
import logo from './logo.png';
import Swal from 'sweetalert2'; // Import SweetAlert
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai'; // Import React Icons
import './LoginPage.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  

  useEffect(() => {
    // Check if the user's email is stored in local storage
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }

    const unsubscribe = authentication.onAuthStateChanged((user) => {
      if (user && loginSuccess) {
        window.location.href = '/add';
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loginSuccess]);

  const handleLogin = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Logged in with: ', user.email);
  
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
  
        Swal.fire({
          title: 'Login Successful',
          text: `Logged in as ${user.email}`,
          icon: 'success',
        });
  
        setLoginSuccess(true);
      })
      .catch((error) => {
        console.error(error);
  
        setError('Incorrect email or password');
        setLoginSuccess(false);
  
        
      });
  };
  

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleForgotPassword = () => {
    sendPasswordResetEmail(authentication, email)
      .then(() => {
        console.log('Password reset email sent to: ', email);
        setResetPasswordSuccess(true);
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setResetPasswordSuccess(false);
        setError('Error sending password reset email');
      });
  };

  const handleSignUp = () => {
    // Redirect to the Sign Up (Registration) page
    window.location.href = '/signin';
  };

  return (
    <div className="wrapper">
      <div className="sidebar">
        <div className="content">
          <img src={logo} alt="Logo" className="main-logo" />
        </div>
        <h1>LOGIN</h1>
        <div className="input-box">
          <div className="input-container">
            <AiOutlineUser className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        <div className="input-box">
          <div className="input-container">
            <AiOutlineLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        <label >
          <input
            placeholder="checkbox"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          Remember Me
        </label>

        <button type="button" className="btn" onClick={handleLogin}>
          LOGIN
        </button>
        <br/>
        <p>
          <a placeholder='forgot' id="forgot-id" href="#" onClick={handleForgotPassword}>
            Forgot Password?
          </a>
        </p>
       <br/>
        <p>
          Don't have an account?{' '}
          <a placeholder='signUp' id="signup-link" href="#" onClick={handleSignUp}>
            Sign Up
          </a>
        </p>

        {resetPasswordSuccess && (
          <div className="success-message">
            Password reset email sent successfully!
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default Login;