import React from 'react';
import Button from 'muicss/lib/react/button';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
import Checkbox from 'muicss/lib/react/checkbox';
import { runScript } from './run_analyses';
const {ipcRenderer} = require('electron')

class VideoSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patientId: '',
      runOpenFace: false,
      runAudioAnalysis: false,
      filePath: '',
    };

    this.selectFilePath = this.selectFilePath.bind(this);
    this.useSelectedFile = this.useSelectedFile.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  handleUserInput(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  selectFilePath(event) {
    event.preventDefault();
    this.fileInput.click();
  }

  useSelectedFile() {
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      console.log('script is running!') // confirmation that the shell script was executed
    })
    ipcRenderer.send('asynchronous-message', ['run_script', 'second arg'])
  }

  render() {
    return (
      <Form>
        <legend>Analyze new session</legend>
        <Input name="patientId" label="Patient ID (required)" value={this.state.patientId} required={true} onChange={this.handleUserInput}/>
        <input type="file" style={{display: 'none'}}  ref={(input) => { this.fileInput = input; }} onChange={this.useSelectedFile} />
        <Checkbox name="runOpenFace" value={this.state.runOpenFace} label="Run OpenFace Analyses" onChange={this.handleUserInput}/>
        <Checkbox name="runAudioAnalysis" value={this.state.runAudioAnalysis} label="Run Speech Analyses" onChange={this.handleUserInput}/>
        <Button variant="raised" onClick={this.selectFilePath}>Select Video</Button>
      </Form>
    );
  }
}

export default VideoSelector;
