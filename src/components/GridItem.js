import React from 'react';
import ReactDOM from 'react-dom';

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



};


class GridItem extends React.Component {

  static get propTypes() {
    return {
      feaure: React.PropTypes.string,
      value: React.PropTypes.number,
      deltaMean: React.PropTypes.string,
      deltaLast: React.PropTypes.string,
    };
  }

  render() {
    return(
      <div style={style.square} className='square'>
        <h3 >
          {this.props.feature}
        </h3>
          Patient: {this.props.value}
          <br />
          Mean: {this.props.deltaMean}
          <br />
          Last Visit: {this.props.deltaLast}
      </div>
    );
  }

}

export default GridItem;
