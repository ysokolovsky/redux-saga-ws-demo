import React, { Component } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { compose, bindActionCreators } from 'redux';
import SpeechScreen from './components/SpeechScreen';
import { actionCreators } from './actions';
import { connect } from 'react-redux';
import './App.css';


export class App extends Component {

  state = {
    message: ''
  }

  componentWillMount() {
    const socket = new ReconnectingWebSocket('ws://127.0.0.1:8765');
    socket.addEventListener('open', () => {
      this.props.connect(socket);
    });
    socket.addEventListener('close', () => {
      socket.reconnect();
    });
  }

  handleChange = (event) => {
    this.setState({message: event.target.value});
  }

  sendMsg = () => {
    if (this.state.message) {
      this.props.send(this.state.message);
      this.setState({message: ''});
    }
  }

  render() {
    return (
      <div className="App">
        <SpeechScreen />
        <div className="send">
          <input
            value={this.state.message}
            onChange={this.handleChange}
          />
          <button
            className="button"
            onClick={this.sendMsg}
          >Send</button>
      </div>
      </div>
  ); 
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    connect: actionCreators.socketConnect,
    send: actionCreators.socketSend,
  }, dispatch);
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withConnect,
)(App);
