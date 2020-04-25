import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { MIN_ELECTION, MAX_ELECTION } from '../constants';

class ElectionSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <SliderTooltip
        open={sliderTooltipVisible}
        // onOpen={handleTooltipOpen}
        // onClose={handleTooltipClose}
        title='Drag slider to adjust value.'
        aria-label='Budget Slider'
        placement='bottom'
        disableFocusListener
        // disableHoverListener
        disableTouchListener
        arrow
      >
        <Slider
          color='secondary'
          track={false}
          name='budget'
          min={MIN_ELECTION}
          max={Math.max(election, MAX_ELECTION)}
          value={election || MIN_ELECTION} // TODO: load on auth
          valueLabelFormat={value => value + '%'}
          // defaultValue={election}
          step={1}
          onChange={(event, value) =>
            this.setState({
              election: value,
              electedExpenseInputMode: false
            })
          }
          // onChangeCommitted={(event, value) => this.setState({ election: value })}
          marks={electedExpenseSliderMarks}
          valueLabelDisplay='on'
          aria-label='Budget Slider'
          aria-labelledby='budget-slider'
          aria-valuetext={election + '%'}
          getAriaLabel={value => `${value}%`}
          getAriaValueText={value => `${value}%`}
        />
      </SliderTooltip>
    );
  }
}

export default ElectionSlider;
