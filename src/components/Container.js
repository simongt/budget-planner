import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Container as MuiContainer } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Paper from './Paper';

const styles = theme => ({
  root: {},
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
