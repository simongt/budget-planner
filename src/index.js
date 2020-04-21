import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const wrapper = document.getElementById('root');

console.log('src/index.js <-- app entry point', wrapper);

wrapper ? ReactDOM.render(<App />, wrapper) : false;
