import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../actions';
import Message from './Message';
import './Screen.css';


class Screen extends Component {
  state = {
    message: ''
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
    const { speechData } = this.props;
    if (speechData && speechData.title && speechData.text) {
      return (
        <React.Fragment>
          <Message
            title={speechData.title}
            text={speechData.text}
            soundUrl={speechData.soundUrl}
          />
          <div className="send">
            <input
              value={this.state.message}
              onChange={this.handleChange}
            />
            <button
              onClick={this.sendMsg}
            >Send</button>
          </div>
        </React.Fragment>
      );
    } else if (!speechData) {
      return <div>No data</div>;
    }
  }
}

const mapStateToProps = (state) => ({
  speechData: state.robotWSDataReducer.apiSpeechData,
});

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    send: actionCreators.socketSend
  }, dispatch)
);

Screen.propTypes = {
  speechData: PropTypes.object,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Screen);

