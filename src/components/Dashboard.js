import React, { Component } from 'react';
// import { connect } from 'react-redux';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // maxWidth: 840,
          marginTop: 36,
          marginBottom: 36
        }}
      >
        <div style={{ marginBottom: 36 }}>
          <Typography variant='h5' gutterBottom align='center'>
            <span style={{ fontWeight: 'bold' }}>{`Welcome${', ' + this.getUserName()}!`}</span>
            <br />
            Let's analyze your monthly budget.
          </Typography>
        </div>
        {/* Budget Form */}
        <div>
          <div>
            {/* Elected Expense */}
            <div
              style={{
                // display: 'grid',
                // placeItems: 'center',
                // minWidth: 640,
                // maxWidth: 960,
                paddingLeft: 48,
                paddingRight: 48,
                marginBottom: 64
              }}
            >
              <div
                style={{
                  marginBottom: 36,
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'flex-end'
                }}
              >
                <Typography variant='h5' gutterBottom>
                  {`How much of your salary will you contribute to elected expenses?`}
                </Typography>
                <InputSpacer />
                {electedExpenseInputMode ? (
                  <div>
                    {/* TODO: replace with outlined material ui text fields */}
                    {/* TODO: implement tab to switch focus between text input fields */}
                    <div style={{ width: 180, display: 'flex', alignItems: 'center' }}>
                      <TextField
                        autoFocus
                        name='election'
                        className='election'
                        required
                        value={election || MIN_ELECTION}
                        onKeyDown={event => {
                          event.persist();
                          this.setState({
                            electedExpenseInputMode: event.keyCode !== 13
                          });
                        }}
                        onChange={event => {
                          event.persist();
                          this.setState(prevState => ({
                            ...prevState,
                            [event.target.name]: this.validateSliderExpense(
                              event.target.value || MIN_ELECTION
                            )
                          }));
                        }}
                        onFocus={event => event.target.select()}
                        onBlur={() =>
                          this.setState(prevState => ({
                            electedExpenseInputMode: false
                          }))
                        }
                        color='secondary'
                        margin='dense'
                        size='small'
                        type='number'
                        placeholder={`${MIN_ELECTION}`}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: 180,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center'
                    }}
                    onClick={() =>
                      this.setState(prevState => ({
                        electedExpenseInputMode: !prevState.electedExpenseInputMode,
                        electedExpenseTooltipVisible: false
                      }))
                    }
                  >
                    <Typography variant='h5' gutterBottom>
                      <InputTooltip
                        open={electedExpenseTooltipVisible}
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
                        <span style={{ color: '#e62958', fontWeight: 'bold' }}>{election}%</span>
                      </InputTooltip>
                    </Typography>
                  </div>
                )}
              </div>
              <ElectionSlider /* TODO: pass props down to children */ />
            </div>

            {/* Annual Salary */}
            <div
              style={{
                // display: 'grid',
                // placeItems: 'center',
                // minWidth: 640,
                // maxWidth: 960,
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
                <InputSpacer />
                {annualSalaryInputMode ? (
                  <Fragment>
                    <Typography variant='h5' gutterBottom>
                      <span style={{ fontWeight: 'bold' }}>{currency.label}</span>
                    </Typography>
                    {/* TODO: implement tab to switch focus between text input fields */}
                    <TextField
                      autoFocus
                      name='annualSalary'
                      className='annualSalary'
                      required
                      value={annualSalary || MIN_ANNUAL_SALARY}
                      onKeyDown={event => {
                        event.persist();
                        this.setState({
                          annualSalaryInputMode: event.keyCode !== 13
                        });
                      }}
                      onChange={event => {
                        event.persist();
                        this.setState(prevState => ({
                          ...prevState,
                          [event.target.name]: this.validateSalary(
                            event.target.value || MIN_ANNUAL_SALARY
                          )
                        }));
                      }}
                      onFocus={event => event.target.select()}
                      onBlur={() =>
                        this.setState(prevState => ({
                          annualSalaryInputMode: false
                        }))
                      }
                      color='secondary'
                      margin='dense'
                      size='small'
                      type='number'
                      placeholder={`${MIN_ANNUAL_SALARY}`}
                    />
                  </Fragment>
                ) : (
                  <div
                    onClick={() =>
                      this.setState(prevState => ({
                        annualSalaryInputMode: !prevState.annualSalaryInputMode,
                        annualSalaryTooltipVisible: false
                      }))
                    }
                  >
                    <Typography variant='h5' gutterBottom>
                      <InputTooltip
                        open={annualSalaryTooltipVisible}
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
                        {/* TODO: resolve decimal bug */}
                        <span style={{ color: '#e62958', fontWeight: 'bold' }}>
                          {this.usdFormat(annualSalary)}
                        </span>
                      </InputTooltip>
                    </Typography>
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Expenses */}
            <div
              style={{
                // display: 'grid',
                // placeItems: 'center',
                // minWidth: 640,
                // maxWidth: 960,
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
                  {`Your total monthly expenses amount to `}
                  <span style={{ fontWeight: 'bold' }}>{monthlyExpenses}.</span>
                </Typography>
              </div>
            </div>

            {/* Monthly Savings */}
            <div
              style={{
                // display: 'grid',
                // placeItems: 'center',
                // minWidth: 640,
                // maxWidth: 960,
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
                  {`Your monthly savings amount to `}
                  <span style={{ fontWeight: 'bold' }}>{monthlySavings}.</span>
                </Typography>
              </div>
            </div>
          </div>

          {/* Submit Budget */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              // minWidth: 640,
              // maxWidth: 960,
              paddingLeft: 48,
              paddingRight: 48,
              marginBottom: 64
            }}
          >
            <Button
              aria-label='Submit Budget Form'
              onClick={this.handleBudgetFormSubmit}
              disabled={budgetFormSubmitted}
              type='button'
              variant='contained'
              className={classes.button}
              size='large'
              // color='secondary'
              color='secondary'
              fullWidth
            >
              {budgetFormSubmitted ? 'In progress…' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default Dashboard;
