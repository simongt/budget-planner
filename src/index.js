import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import { toast, Slide } from 'react-toastify';
import 'typeface-roboto';
import 'react-toastify/dist/ReactToastify.css';

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

wrapper ? ReactDOM.render(<Root />, wrapper) : false;
