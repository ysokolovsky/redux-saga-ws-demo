import React, { Component } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { compose, bindActionCreators } from 'redux';
import Screen from './components/Screen';
import { actionCreators } from './actions';
import { connect } from 'react-redux';
import './App.css';


export class App extends Component {

  componentWillMount() {
    const socket = new ReconnectingWebSocket('ws://127.0.0.1:8765');
    socket.addEventListener('open', () => {
      this.props.connect(socket);
    });
    socket.addEventListener('close', () => {
      socket.reconnect();
    });
  }

  render() {
    return (
      <div className="App">
        <Screen />
      </div>
  ); 
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    connect: actionCreators.socketConnect
  }, dispatch);
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withConnect,
)(App);
