import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { authentication } from '../../firebase';

import Swal from 'sweetalert2'; // Import SweetAlert
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai'; // Import React Icons
import logo from './logo.png';
import './Sign.css'; // Update the import to a new CSS file

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in both email and password!',
      });
    } else {
      createUserWithEmailAndPassword(authentication, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Logged in with:', user.email);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'You have successfully registered.',
          });
          // Update the pathname using window.location.href
         
            window.location.href = '/Login';
          
        })
        .catch((error) => {
          if (error.code === 'auth/invalid-email') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Invalid email address!',
            });
          } else if (error.code === 'auth/email-already-in-use') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Email already in use.',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'An error occurred. Please try again later.',
            });
          }
        });
    }
  }

  return (
    <div className='wrap'>
      <div className="school-sign-in-container">
      <img src={logo} alt="Logo"  className="logo-sign" />
        <h1>Register</h1>
        <div className="input-container">
          <AiOutlineUser className="input-icon" />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="input-container">
          <AiOutlineLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button className="register-button" onClick={() => handleRegister()}>
          Register
        </button>
      </div>
    </div>
  );
}

export default SignIn;
