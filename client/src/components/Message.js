import React from 'react';
import { Fade } from 'react-reveal';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../actions';
import './Message.css';


class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTitle: true,
      showSubtitle: false,
      prevAudio: null,
    };
  }

  triggerRender = 0;

  componentDidMount() {
    setTimeout(() => {
      this.play(this.props.soundUrl);
    }, 150);
  }

  componentWillUpdate(nextProps) {
    if (this.props.soundUrl !== nextProps.soundUrl) {
      setTimeout(() => {
        this.play(this.props.soundUrl);
      }, 150);
      this.triggerRender = new Date().getTime();
    }
  }

  componentWillUnmount() {
    if (this.state.prevAudio) {
      this.state.prevAudio.pause();
    }
    const { cleanSpeech } = this.props;
    cleanSpeech();
  }

  play = (url) => {
    if (this.state.prevAudio) {
      this.state.prevAudio.pause();
    }
    const audio = new Audio(url);
    this.setState({ prevAudio: audio });
    audio.play();
    setTimeout(() => {
      this.setState({
        showSubtitle: true,
      });
    }, 1000);
  };

  render() {
    const { title, text } = this.props;
    return (
      <div className="block">
        <Fade
          duration={1500}
          opposite
          appear
          spy={this.triggerRender}
          collapse
          when={this.state.showTitle}
        >
          <div className="title">{title}</div>
        </Fade>
        <Fade
          duration={2000}
          opposite
          appear
          spy={this.triggerRender}
          collapse
          when={this.state.showSubtitle}
        >
          <div className='text'>
            {text}
          </div>
        </Fade>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    cleanSpeech: actionCreators.cleanSpeech
  }, dispatch)
);

export default compose(
  connect(null, mapDispatchToProps),
)(Message);

