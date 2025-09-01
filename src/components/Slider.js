import React, { Component } from 'react';
// import { connect } from 'react-redux';

class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        {/* Annual Salary */}
        <div
          style={{
            minWidth: 640,
            // maxWidth: 1280,
            paddingLeft: 48,
            paddingRight: 48,
            marginBottom: 64
          }}
        >
          <div
            style={{
              marginBottom: 36,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end'
            }}
          >
            <Typography variant='h5' gutterBottom>
              {`What's your annual salary?`}
            </Typography>
            <span style={{ width: 8, height: 48 }}></span>
            {replaceWithInput ? (
              <TextField
                autoFocus
                name='sliderValue'
                className='currency-value'
                required
                value={sliderValue || 0}
                onChange={event => {
                  event.persist();
                  this.setState(prevState => ({
                    ...prevState,
                    [event.target.name]: event.target.value
                  }));
                }}
                onFocus={event => event.target.select()}
                onBlur={() =>
                  this.setState(prevState => ({
                    replaceWithInput: !prevState.replaceWithInput
                  }))
                }
                color='secondary'
                margin='dense'
                size='small'
                type='number'
                placeholder='0'
              />
            ) : (
              <div
                onClick={() =>
                  this.setState(prevState => ({
                    replaceWithInput: !prevState.replaceWithInput
                  }))
                }
              >
                <Typography variant='h5' gutterBottom>
                  <Tooltip
                    // open={sliderTooltipIsOpen}
                    // onOpen={handleTooltipOpen}
                    // onClose={handleTooltipClose}
                    title='Press to enter new value.'
                    aria-label='Budget Slider'
                    placement='right'
                    disableFocusListener
                    // disableHoverListener
                    disableTouchListener
                    arrow
                  >
                    <span style={{ fontWeight: 'bold' }}>{this.usdFormat(sliderValue)}</span>
                  </Tooltip>
                </Typography>
              </div>
            )}
          </div>
          <Tooltip
            // open={sliderTooltipIsOpen}
            // onOpen={handleTooltipOpen}
            // onClose={handleTooltipClose}
            title='Drag slider to adjust value.'
            aria-label='Budget Slider'
            placement='top'
            disableFocusListener
            // disableHoverListener
            disableTouchListener
            arrow
          >
            <Slider
              color='secondary'
              track={false}
              name='budget'
              min={sliderValue > 250000 ? sliderValue - 250000 : 0}
              max={Math.max(sliderValue, MAX_BUDGET)}
              // defaultValue={sliderValue}
              value={this.state.sliderValue || 0} // TODO: load on auth
              valueLabelFormat={value => this.abbreviateValue(value)}
              step={500}
              onChange={(event, value) =>
                this.setState({ sliderValue: value, replaceWithInput: false })
              }
              // onChangeCommitted={(event, value) => this.setState({ sliderValue: value })}
              marks={sliderMarks}
              valueLabelDisplay='on'
              aria-label='Budget Slider'
              aria-labelledby='budget-slider'
              aria-valuetext={this.abbreviateValue(sliderValue)}
              getAriaLabel={value => `${value}`}
              getAriaValueText={value => `${value}`}
            />
          </Tooltip>
        </div>
        {/* Monthly Expenses */}
        <div
          style={{
            minWidth: 640,
            // maxWidth: 1280,
            paddingLeft: 48,
            paddingRight: 48,
            marginBottom: 64
          }}
        >
          <div
            style={{
              marginBottom: 36,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end'
            }}
          >
            <Typography variant='h5' gutterBottom>
              {`What is the total amount of your monthly expenses?`}
            </Typography>
            <span style={{ width: 8, height: 48 }}></span>
            {replaceWithInput ? (
              <TextField
                autoFocus
                name='sliderValue'
                className='currency-value'
                required
                value={sliderValue || 0}
                onChange={event => {
                  event.persist();
                  this.setState(prevState => ({
                    ...prevState,
                    [event.target.name]: event.target.value
                  }));
                }}
                onFocus={event => event.target.select()}
                onBlur={() =>
                  this.setState(prevState => ({
                    replaceWithInput: !prevState.replaceWithInput
                  }))
                }
                color='secondary'
                margin='dense'
                size='small'
                type='number'
                placeholder='0'
              />
            ) : (
              <div
                onClick={() =>
                  this.setState(prevState => ({
                    replaceWithInput: !prevState.replaceWithInput
                  }))
                }
              >
                <Typography variant='h5' gutterBottom>
                  <Tooltip
                    // open={sliderTooltipIsOpen}
                    // onOpen={handleTooltipOpen}
                    // onClose={handleTooltipClose}
                    title='Press to enter new value.'
                    aria-label='Budget Slider'
                    placement='right'
                    disableFocusListener
                    // disableHoverListener
                    disableTouchListener
                    arrow
                  >
                    <span style={{ fontWeight: 'bold' }}>{this.usdFormat(sliderValue)}</span>
                  </Tooltip>
                </Typography>
              </div>
            )}
          </div>
          <Tooltip
            // open={sliderTooltipIsOpen}
            // onOpen={handleTooltipOpen}
            // onClose={handleTooltipClose}
            title='Drag slider to adjust value.'
            aria-label='Budget Slider'
            placement='top'
            disableFocusListener
            // disableHoverListener
            disableTouchListener
            arrow
          >
            <Slider
              color='secondary'
              track={false}
              name='budget'
              min={sliderValue > 250000 ? sliderValue - 250000 : 0}
              max={Math.max(sliderValue, MAX_BUDGET)}
              // defaultValue={sliderValue}
              value={this.state.sliderValue || 0} // TODO: load on auth
              valueLabelFormat={value => this.abbreviateValue(value)}
              step={500}
              onChange={(event, value) =>
                this.setState({ sliderValue: value, replaceWithInput: false })
              }
              // onChangeCommitted={(event, value) => this.setState({ sliderValue: value })}
              marks={sliderMarks}
              valueLabelDisplay='on'
              aria-label='Budget Slider'
              aria-labelledby='budget-slider'
              aria-valuetext={this.abbreviateValue(sliderValue)}
              getAriaLabel={value => `${value}`}
              getAriaValueText={value => `${value}`}
            />
          </Tooltip>
        </div>
        {/* Savings */}
        <div
          style={{
            minWidth: 640,
            // maxWidth: 1280,
            paddingLeft: 48,
            paddingRight: 48,
            marginBottom: 64
          }}
        >
          <div
            style={{
              marginBottom: 36,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end'
            }}
          >
            <Typography variant='h5' gutterBottom>
              {`What is the total amount of your savings?`}
            </Typography>
            <span style={{ width: 8, height: 48 }}></span>
            {replaceWithInput ? (
              <TextField
                autoFocus
                name='sliderValue'
                className='currency-value'
                required
                value={sliderValue || 0}
                onChange={event => {
                  event.persist();
                  this.setState(prevState => ({
                    ...prevState,
                    [event.target.name]: event.target.value
                  }));
                }}
                onFocus={event => event.target.select()}
                onBlur={() =>
                  this.setState(prevState => ({
                    replaceWithInput: !prevState.replaceWithInput
                  }))
                }
                color='secondary'
                margin='dense'
                size='small'
                type='number'
                placeholder='0'
              />
            ) : (
              <div
                onClick={() =>
                  this.setState(prevState => ({
                    replaceWithInput: !prevState.replaceWithInput
                  }))
                }
              >
                <Typography variant='h5' gutterBottom>
                  <Tooltip
                    // open={sliderTooltipIsOpen}
                    // onOpen={handleTooltipOpen}
                    // onClose={handleTooltipClose}
                    title='Press to enter new value.'
                    aria-label='Budget Slider'
                    placement='right'
                    disableFocusListener
                    // disableHoverListener
                    disableTouchListener
                    arrow
                  >
                    <span style={{ fontWeight: 'bold' }}>{this.usdFormat(sliderValue)}</span>
                  </Tooltip>
                </Typography>
              </div>
            )}
          </div>
          <Tooltip
            // open={sliderTooltipIsOpen}
            // onOpen={handleTooltipOpen}
            // onClose={handleTooltipClose}
            title='Drag slider to adjust value.'
            aria-label='Budget Slider'
            placement='top'
            disableFocusListener
            // disableHoverListener
            disableTouchListener
            arrow
          >
            <Slider
              color='secondary'
              track={false}
              name='budget'
              min={sliderValue > 250000 ? sliderValue - 250000 : 0}
              max={Math.max(sliderValue, MAX_BUDGET)}
              // defaultValue={sliderValue}
              value={this.state.sliderValue || 0} // TODO: load on auth
              valueLabelFormat={value => this.abbreviateValue(value)}
              step={500}
              onChange={(event, value) =>
                this.setState({ sliderValue: value, replaceWithInput: false })
              }
              // onChangeCommitted={(event, value) => this.setState({ sliderValue: value })}
              marks={sliderMarks}
              valueLabelDisplay='on'
              aria-label='Budget Slider'
              aria-labelledby='budget-slider'
              aria-valuetext={this.abbreviateValue(sliderValue)}
              getAriaLabel={value => `${value}`}
              getAriaValueText={value => `${value}`}
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(Slider);

export default Slider;
