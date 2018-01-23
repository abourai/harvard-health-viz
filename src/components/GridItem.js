import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const style = {

  item: {
		background: 'grey',
	},

  square: {
    fontFamily: '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
    fontWeight: 300,
    fontSize: '1.0em',

    background: '#f4e3e8',
    height: '100%',
    width: '100%',
    position: 'absolute',
    textAlign: 'center', /* align horizontal */
    alignItems: 'center', /* align vertical */
    color: '#757575',
  },

  green: {
    color: '#006600',
  },

  red: {
    color: '#8f0000',
  },



};

const featureMap = {
  'brow_lower_expressivity': 'Brow Lower Expressivity',
  'brow_raise_expressivity': 'Brow Raiser Expressivity',
  'overall_expressivity': 'Overall Expressivity',
  'smile_intensity': 'Smile Intensity',
  'smile_length': 'Smile Length',
}


class GridItem extends React.Component {

  static get propTypes() {
    return {
      feaure: PropTypes.string,
      value: PropTypes.number,
      deltaMean: PropTypes.number,
      deltaLast: PropTypes.number,
      deltaFirst: PropTypes.number
    };
  }

  render() {
    return(
      <div style={style.square} className='square'>
        <h3 >
          {featureMap[this.props.feature]}
        </h3>
          <h5>Patient:</h5> <p>{this.props.value}</p>
          <h5>Deviation from Mean:</h5>  <p style={this.props.deltaMean > 0 ? style.green : style.red}>{this.props.deltaMean}</p>
          <h5>Deviation from Last Visit:</h5>  <p style={this.props.deltaLast > 0 ? style.green : style.red}>{this.props.deltaLast}</p>
          <h5>Deviation from First Visit: </h5> <p style={this.props.deltaFirst > 0 ? style.green : style.red}>{this.props.deltaFirst}</p>
      </div>
    );
  }

}

export default GridItem;
