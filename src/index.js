import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { toast, Slide } from 'react-toastify';
import 'typeface-roboto';
import 'react-toastify/dist/ReactToastify.css';

// designed to protect from so-called XSRF (cross-site request forgery) attacks
// see: https://javascript.info/cookie#samesite
document.cookie = 'SameSite=None; Secure';

const wrapper = document.getElementById('root');

toast.configure({
  // toastClassName: '',
  position: toast.POSITION.BOTTOM_RIGHT,
  transition: Slide,
  autoClose: 4000,
  pauseOnHover: false,
  pauseOnVisibilityChange: false,
  closeButton: false,
  draggable: true,
  draggablePercent: 25
});

console.log('src/index.js <-- app entry point', wrapper);

wrapper ? ReactDOM.render(<App />, wrapper) : false;
