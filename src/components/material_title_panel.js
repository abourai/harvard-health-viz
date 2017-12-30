import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  root: {
    fontFamily: '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
    fontWeight: 300,
  },
  header: {
    backgroundColor: '#a9435d',
    color: 'white',
    padding: '16px',
    fontSize: '1.5em',
  },

  body: {
    position: 'absolute',
    textAlign: 'center', /* align horizontal */
    alignItems: 'center', /* align vertical */
  }
};

const MaterialTitlePanel = (props) => {
  const rootStyle = styles.root;

  return (
    <div style={rootStyle}>
      <div style={styles.header}>{props.title}</div>
      <div style={styles.body}>
      {props.children}
    </div>
    </div>
  );
};

MaterialTitlePanel.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  children: PropTypes.object,
};

export default MaterialTitlePanel;
