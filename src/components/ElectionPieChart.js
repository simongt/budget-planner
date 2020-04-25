import React, { Component } from 'react';
// import { connect } from 'react-redux';
import PieChart, {
  CommonSeriesSettings,
  Legend,
  Series,
  Export,
  Label,
  Title,
  Tooltip as PieChartTooltip,
  Subtitle
} from 'devextreme-react/pie-chart';

class ElectionPieChart extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <PieChart
        id={'pie'}
        type={'doughnut'}
        innerRadius={0.25}
        palette={'Material'}
        dataSource={budgetData}
      >
        <Title text={'Expense Analysis'} />

        <CommonSeriesSettings>
          <Label visible={false} />
        </CommonSeriesSettings>
        <Series name={'Expense Report'} argumentField={'label'} valueField={'amount'} />

        <Export enabled={true} />
        <Legend visible={true} />

        <PieChartTooltip
          enabled={true}
          format={'currency'}
          customizeTooltip={this.customizePieChartTooltip}
        />
      </PieChart>
    );
  }
}

export default ElectionPieChart;
