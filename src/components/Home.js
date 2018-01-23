import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from 'react-sidebar';
import GridItem from './GridItem';
import MaterialTitlePanel from './material_title_panel';
import SidebarContent from './sidebar_content';
import LineExample from './line_example';
import VideoSelector from './select_video';
import Button from 'muicss/lib/react/button';
import Summary from './Summary'
const {ipcRenderer} = require('electron')

const styles = {
  contentHeaderMenuLink: {
    textDecoration: 'none',
    color: 'white',
    padding: 8,
  },
  content: {
    padding: '16px',
  },
  form: {
    padding: '40px',
    textAlign: 'center', /* align horizontal */
    alignItems: 'left', /* align vertical */
  }
};

const mql = window.matchMedia(`(min-width: 800px)`);

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mql: mql,
      docked: false,
      open: false,
      patient_selected: false,
      patient_id: null,
      patientMeans: null,
      patientMeansLoaded: false,
      showDataForm: false,
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.onAddNewData = this.onAddNewData.bind(this);
    this.requestMeans = this.requestMeans.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
    this.requestMeans();
    this.setState({mql: mql, docked: mql.matches});
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen(open) {
    this.setState({open: open});
  }

  onAddNewData() {
    this.setState({ showDataForm: true });
  }

  mediaQueryChanged() {
    this.setState({
      mql: mql,
      docked: this.state.mql.matches,
    });
  }

  requestMeans() {
    ipcRenderer.send('asynchronous-message', ['get_means', 'visual'])

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      this.setState({
        patientMeans: arg,
        patientMeansLoaded: true,
      });
    })
  }

  toggleOpen(ev) {
    this.setState({open: !this.state.open});

    if (ev) {
      ev.preventDefault();
    }
  }

  onChildClicked(newState, patient_id) {
    this.setState({
      patient_selected: newState,
      patient_id,
    });
  }

  render() {
    const sidebar = <SidebarContent callbackParent={(newState, patient_id) => this.onChildClicked(newState, patient_id)}/>;

    const contentHeader = (
      <span>
        {!this.state.docked &&
         <a onClick={this.toggleOpen.bind(this)} href="#" style={styles.contentHeaderMenuLink}>=</a>}
        <span> Patient Information</span>
      </span>);

    const sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      open: this.state.open,
      onSetSidebarOpen: this.onSetSidebarOpen,

    };

    const landingPage = (
        <div style={styles.content}>
          <p>
            Select a patient to view summarized features or add new data below
          </p>
          <p>
            Once you select a patient you can visualize their session information through both a
            numerical and graphical interface.
          </p>
          <Button variant="raised" color="primary" onClick={this.onAddNewData}>Add new data</Button>
        </div>
    );


    if (this.state.patient_selected && this.state.patientMeansLoaded) {
      return (
        <div style={styles.content}>
          <Sidebar {...sidebarProps}>
            <MaterialTitlePanel title={contentHeader}>

            </MaterialTitlePanel>
            <Summary patientID={this.state.patient_id} means={this.state.patientMeans}/>
          </Sidebar>
        </div>

      );
    }
    else {

      return (
        <div>
          <Sidebar
            {...sidebarProps}>
            <MaterialTitlePanel title={contentHeader}>
              { this.state.showDataForm ? <VideoSelector style={styles.form}/> : landingPage }
            </MaterialTitlePanel>

          </Sidebar>
        </div>
      );
    }
  }
}
 export default Home;
//ReactDOM.render(<App />, document.getElementById('example'));
