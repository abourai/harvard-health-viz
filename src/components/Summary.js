import React from 'react';
import _ from 'lodash';
import { WidthProvider, Responsive } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import Button from 'muicss/lib/react/button';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
import Checkbox from 'muicss/lib/react/checkbox';
import GridItem from './GridItem';
import { runScript } from './run_analyses';
const {ipcRenderer} = require('electron')

class Summary extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      patientID: props.patientID,
      patientData: null,
      patientDataLoaded: false,
      filePath: '',
      features: [],
      gridItems: [],
      means: props.means,
      mostRecentVisit: null,
      deltaFirst: null,
      deltaLast: null,
      deltaMeans: null,
    };

    this.formatPatientData = this.formatPatientData.bind(this);
    this.requestPatientData = this.requestPatientData.bind(this);
    this.populateGridFeatures = this.populateGridFeatures.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.createGridElement = this.createGridElement.bind(this);
  }

  componentWillMount() {
    this.requestPatientData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.patientID === this.state.patientID) return;
    this.setState({
      patientID: nextProps.patientID,
    }, () => this.requestPatientData());
  }

  componentWillUnmount() {
  }

  formatPatientData() {
    const featureValues = _.sortBy(this.state.patientData);
    const mostRecentVisit = _.last(featureValues);
    const firstVisit = _.first(featureValues);
    const features = _.keys(mostRecentVisit);

    const isFirstVisit = firstVisit === mostRecentVisit;

    const deltaMeans = _.mapValues(mostRecentVisit, (value, feature) => {
      return (value - this.state.means[feature]).toFixed(3);
    });

    let deltaFirst = {};
    let deltaLast = {};

    if (!isFirstVisit) {
      deltaLast = _.mapValues(mostRecentVisit, (value, feature) => {
        return (value - featureValues[featureValues.length - 2][feature]).toFixed(3);
      });

      deltaFirst = _.mapValues(mostRecentVisit, (value, feature) => {
        return (value - firstVisit[feature]).toFixed(3);
      });
    }

    this.setState({
      dataReady: true,
      features,
      mostRecentVisit,
      deltaMeans,
      deltaFirst,
      deltaLast,
    }, () => this.populateGridFeatures());
  }

  populateGridFeatures() {
    const gridItems = [];
    let count = 0;
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer"
    };
    _.forEach(this.state.features, feature => {
      gridItems.push(<div key={count} data-grid={{x: count * 4 % 12, w: 4, h: 4, y: 0}}>
                        <GridItem  feature={feature} value={(this.state.mostRecentVisit[feature]).toFixed(3)}
                          deltaMean={this.state.deltaMeans[feature]} deltaFirst={this.state.deltaFirst[feature]}
                          deltaLast={this.state.deltaLast[feature]}>

                        </GridItem>
                      </div>);
      count += 1;
    });

    this.setState({
      gridItems,
    });
  }

  requestPatientData() {
    ipcRenderer.send('asynchronous-message', ['get_patient', this.state.patientID])

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      this.setState({
        patientData: arg,
        patientDataLoaded: true,
      }, () => this.formatPatientData());
    })
  }

  createGridElement(el) {

    const i = el.key;
    return (
      {el}
    );
  }

  onRemoveItem(i) {
    console.log("removing", i);
    this.setState({ gridItems: _.reject(this.state.gridItems, { i: i }) });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
    this.setState({ layout: layout });
  }

  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  render() {

    const layoutProps = {
      className: "layout",
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      breakpoints: {lg: 768, md: 600, sm: 400, xs: 200, xxs: 0},
      rowHeight: 100
    };
    return (

      <div>
      <ResponsiveReactGridLayout
        isDraggable={false}
        onBreakpointChange={this.onBreakpointChange}
        {...layoutProps}
      >
        {this.state.gridItems}
      </ResponsiveReactGridLayout>
      </div>

    );

  }
}

export default Summary;
