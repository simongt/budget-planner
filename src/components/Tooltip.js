import React from 'react';
import { withStyles, Tooltip } from '@material-ui/core';

export const SliderTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'rgba(255, 255, 255, 0.95)',
    boxShadow: theme.shadows[1],
    fontSize: 12,
    marginTop: 25
  },
  arrow: {
    color: 'rgba(0, 0, 0, 0.75)'
  }
}))(Tooltip);

export const InputTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'rgba(255, 255, 255, 0.95)',
    boxShadow: theme.shadows[1],
    fontSize: 12
  },
  arrow: {
    color: 'rgba(0, 0, 0, 0.75)'
  }
}))(Tooltip);

export const NavbarTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: 'rgba(230,41,88, 0.75)',
    color: 'rgba(255, 255, 255, 0.95)',
    boxShadow: theme.shadows[1],
    fontSize: 12
  },
  arrow: {
    color: 'rgba(230,41,88, 0.75)'
  }
}))(Tooltip);
