import React from 'react';
import ReactDOM from 'react-dom';
import { Auth, Home, Landing, Report, Slider } from './js/components';

const wrapper = document.getElementById('root');

wrapper ? ReactDOM.render(<Landing />, wrapper) : false;
