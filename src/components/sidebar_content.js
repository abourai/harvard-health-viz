import React from 'react';
import MaterialTitlePanel from './material_title_panel';
import PropTypes from 'prop-types';
const fs = require('fs');
const patientFolder = 'src/assets/data/openface';

console.log(patientFolder);
console.log(process.cwd())


const styles = {
  sidebar: {
    width: 256,
    height: '100%',
  },
  sidebarLink: {
    display: 'block',
    padding: '16px 0px',
    color: '#757575',
    textDecoration: 'none',
  },
  divider: {
    margin: '8px 0',
    height: 1,
    backgroundColor: '#757575',
  },
  content: {
    padding: '16px',
    height: '100%',
    backgroundColor: 'white',
  },
};

let clicked = false;



const SidebarContent = (props) => {
  const style = styles.sidebar;

  const links = [];

  const btnClick = (obj) => {
    const onClicked = !clicked;
    alert('---'+obj);
    console.log(props);
    props.callbackParent(onClicked); // we notify our parent

  }
  fs.readdirSync(patientFolder).forEach(file => {
    console.log("Patient " + file);
    links.push(
      <a key={file} onClick={() => btnClick(file)} style={styles.sidebarLink}>Patient {file}</a>);

  })

  console.log(links);


  return (
    <MaterialTitlePanel title="Patients" style={style}>
      <div style={styles.content}>
        <div style={styles.divider} />
        {links}
      </div>
    </MaterialTitlePanel>
  );
};

SidebarContent.propTypes = {
  style: PropTypes.object,
};

export default SidebarContent;
