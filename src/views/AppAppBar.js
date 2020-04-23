import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';
import AppBar from '../components/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';

const styles = theme => ({
  title: {
    fontSize: 24
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between'
  },
  left: {
    flex: 1
  },
  leftLinkActive: {
    color: theme.palette.common.white
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3),
    cursor: 'pointer'
  },
  linkSecondary: {
    color: theme.palette.secondary.main
  }
});

const NavbarTooltip = withStyles(theme => ({
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

function AppAppBar(props) {
  const { classes, authenticated, oauthLogin, logout } = props;
  const [tooltipIsOpen, setTooltipIsOpen] = React.useState(true);

  const handleTooltipClose = (delay = 0) => {
    setTimeout(() => {
      setTooltipIsOpen(false);
    }, delay);
  };

  const handleTooltipOpen = (delay = 0) => {
    setTimeout(() => {
      setTooltipIsOpen(true);
    }, delay);
  };

  useEffect(() => {
    handleTooltipClose(5000);
  }, [tooltipIsOpen]);

  return (
    <div>
      <AppBar position='fixed'>
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <Link
            variant='h6'
            underline='none'
            color='inherit'
            className={classes.title}
            // href='/'
          >
            {'Budget Planner'}
          </Link>
          <div className={classes.right}>
            {authenticated ? (
              <Fragment>
                <NavbarTooltip
                  title='Sign out of account.'
                  placement='right'
                  aria-label='Sign-out'
                  disableFocusListener
                  // disableHoverListener
                  disableTouchListener
                  arrow
                >
                  <Link
                    color='inherit'
                    variant='h6'
                    underline='none'
                    className={classes.rightLink}
                    onClick={logout}
                  >
                    {'Log Out'}
                  </Link>
                </NavbarTooltip>
              </Fragment>
            ) : (
              <Fragment>
                <NavbarTooltip
                  open={tooltipIsOpen}
                  onOpen={handleTooltipOpen}
                  onClose={handleTooltipClose}
                  title='Sign in to get started.'
                  placement='right'
                  aria-label='Google sign-in'
                  disableFocusListener
                  // disableHoverListener
                  disableTouchListener
                  arrow
                >
                  <Link
                    aria-label='Sign in with Google'
                    onClick={oauthLogin}
                    color='inherit'
                    variant='h6'
                    underline='none'
                    className={classes.rightLink}
                  >
                    {'Sign In'}
                  </Link>
                </NavbarTooltip>
                <Link
                  aria-label='Sign up with email'
                  variant='h6'
                  underline='none'
                  className={clsx(classes.rightLink, classes.linkSecondary)}
                  onClick={() => {
                    console.log('Sign up pressed.');
                  }}
                >
                  {'Sign Up'}
                </Link>
              </Fragment>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppAppBar);
