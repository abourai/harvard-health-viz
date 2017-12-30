import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
  Label, LabelList } from 'recharts';

var myData = require('../assets/data/au_express.json');
const data = [
  { name: '3/18/2017', Mean: 9.8, 'Patient 0': 7.9 },
  { name: '5/18/2017', Mean: 9.8, 'Patient 0': 8.8 },
  { name: '7/18/2017', Mean: 9.8, 'Patient 0': 8.3},
  { name: '9/18/2017', Mean: 9.8, 'Patient 0': 7.6 },
];

console.log(myData);
console.log(data);
const style = {

  title: {
    fontFamily: '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
    color: '#757575',
    fontSize: '1.9em',

  },

  body: {
    fontFamily: '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
    color: '#757575',
    fontSize: '1.0em',
  }

}

class LineExample extends React.Component {
  render() {
    console.log(Line);
    return (
      <div >
        <div style={style.title}>
        AU Expressivity
        </div>
        <AreaChart width={600} height={400} data={myData}
            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
        <XAxis allowDecimals={false} dataKey="X" />
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Area type='monotone' dataKey='Y' stroke='#8884d8' fill='#8884d8' />
      </AreaChart>
      </div>
    );
  }
};

export default LineExample;
