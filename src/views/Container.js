import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Container as MuiContainer } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Paper from '../components/Paper';

const styles = theme => ({
  root: {
    // backgroundColor: theme.palette.primary.main
    // display: 'grid',
    // placeItems: 'center',
    // height: 'calc(100vh - 70px)',
    // backgroundImage: 'url(' + require('../static/assets/images/curvy-lines.png') + ')',
    // backgroundRepeat: 'no-repeat',
    // backgroundPosition: 'center center',
    // backgroundSize: 'cover',
    // backgroundAttachment: 'fixed'
  },
  paper: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3, 3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6, 6)
    }
  }
});

function Container(props) {
  const { children, classes } = props;

  return (
    <div className={classes.root}>
      <MuiContainer maxWidth='sm'>
        <Box mt={4} mb={4}>
          <Paper className={classes.paper}>{children}</Paper>
        </Box>
      </MuiContainer>
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Container);
