import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import Img from 'react-cool-img';
import { withWidth, withStyles, Tooltip, Link as MuiLink } from '@material-ui/core';
import { isWidthUp } from '@material-ui/core/withWidth';
import AppBar from '../components/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import { sleep } from '../util';

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

const PiggyBankLogo = ({ width, height }) => (
  <Img
    style={{ backgroundColor: 'transparent', width, height }}
    src={require('../static/assets/images/piggy-bank--transparent--250px.png')}
    alt='Piggy Bank'
  />
);

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
  const { classes, authenticated, signup, login, handleLogout } = props;
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
                    onClick={handleLogout}
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
                    aria-label='Sign in by either email or Google'
                    onClick={login}
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
                  onClick={signup}
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

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

// export default withStyles(styles)(AppAppBar);
export default withWidth()(withStyles(styles)(AppAppBar));
