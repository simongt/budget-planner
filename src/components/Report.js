import React, { Component } from 'react';
// import { connect } from 'react-redux';

class Report extends Component {
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
        <div style={{ marginBottom: 16 }}>
          <Typography variant='h5' gutterBottom align='center'>
            <span style={{ fontWeight: 'bold' }}>{`Here's your budget analyis${
              ', ' + this.getUserName()
            }.`}</span>
            <br />
            Happy savings!
          </Typography>
        </div>

        {/* Expense Report + Back Button */}
        <Container>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              justifyContent: 'space-between'
            }}
          >
            <ElectionPieChart />

            {/* Expense Report */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* Elected Expense */}
              <Typography variant='h5' gutterBottom>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{}}>{`Election`}</span>
                  <div
                    style={{
                      marginLeft: 24,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{election}%</span>
                    <div></div>
                  </div>
                </div>
              </Typography>

              {/* Annual Salary */}
              <Typography variant='h5' gutterBottom>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{}}>{`Annual Salary`}</span>
                  <div
                    style={{
                      marginLeft: 24,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{this.usdFormat(annualSalary)}</span>
                    <div></div>
                  </div>
                </div>
              </Typography>

              {/* Monthly Expenses */}
              <Typography variant='h5' gutterBottom>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{}}>{`Monthly Expenses`}</span>
                  <div
                    style={{
                      marginLeft: 24,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{monthlyExpenses}</span>
                    <div></div>
                  </div>
                </div>
              </Typography>

              {/* Monthly Savings */}
              <Typography variant='h5' gutterBottom>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{}}>{`Monthly Savings`}</span>
                  <div
                    style={{
                      marginLeft: 24,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{monthlySavings}</span>
                    <div></div>
                  </div>
                </div>
              </Typography>
            </div>

            {/* Unsubmit */}
            <Button
              aria-label='Go Back'
              onClick={this.handleBudgetFormSubmit}
              disabled={!budgetFormSubmitted}
              type='button'
              variant='contained'
              className={classes.button}
              size='large'
              // color='secondary'
              color='primary'
              fullWidth
            >
              {!budgetFormSubmitted ? 'In progress…' : 'Back'}
            </Button>
          </div>
        </Container>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(Report);

export default Report;
