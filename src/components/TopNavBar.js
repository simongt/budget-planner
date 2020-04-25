import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withWidth, withStyles, Link as MuiLink } from '@material-ui/core';
import { isWidthUp } from '@material-ui/core/withWidth';
import AppBar from './AppBar';
import Toolbar, { styles as toolbarStyles } from './Toolbar';
import { sleep } from '../util';
import { currencies } from '../constants';
import { NavbarTooltip, PiggyBankLogo } from './';

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

function TopNavBar(props) {
  const { classes, authenticated, oauthLogin, logout } = props;
  const [tooltipIsOpen, setTooltipIsOpen] = React.useState(true);

  const handleTooltipClose = (delay = 0) => {
    sleep(delay).then(() => setTooltipIsOpen(false));
  };

  const handleTooltipOpen = (delay = 0) => {
    sleep(delay).then(() => setTooltipIsOpen(true));
  };

  useEffect(() => {
    handleTooltipClose(5000);
  }, [tooltipIsOpen]);

  return (
    <div>
      <AppBar position='fixed'>
        <Toolbar className={classes.toolbar}>
          {isWidthUp('sm', props.width) && (
            <div className={classes.left}>
              <PiggyBankLogo width={50} height={50} />
            </div>
          )}
          <MuiLink
            variant='h6'
            underline='none'
            color='inherit'
            className={classes.title}
            // href='/'
          >
            {'Budget Planner'}
          </MuiLink>
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
                  <MuiLink
                    color='inherit'
                    variant='h6'
                    underline='none'
                    className={classes.rightLink}
                    onClick={logout}
                  >
                    {'Log Out'}
                  </MuiLink>
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
                  <MuiLink
                    aria-label='Sign in with Google'
                    onClick={oauthLogin}
                    color='inherit'
                    variant='h6'
                    underline='none'
                    className={classes.rightLink}
                  >
                    {'Sign In'}
                  </MuiLink>
                </NavbarTooltip>
                <MuiLink
                  aria-label='Sign up with email'
                  variant='h6'
                  underline='none'
                  className={clsx(classes.rightLink, classes.linkSecondary)}
                  onClick={() => {
                    console.log('Sign up pressed.');
                  }}
                >
                  {'Sign Up'}
                </MuiLink>
              </Fragment>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}

TopNavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

// export default withStyles(styles)(TopNavBar);
export default withWidth()(withStyles(styles)(TopNavBar));
