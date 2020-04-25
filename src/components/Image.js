import React from 'react';
import Img from 'react-cool-img';

export const PiggyBankLogo = ({ width, height }) => (
  <Img
    style={{ backgroundColor: 'transparent', width, height }}
    src={require('../static/assets/images/piggy-bank--transparent--250px.png')}
    alt='Piggy Bank'
  />
);
