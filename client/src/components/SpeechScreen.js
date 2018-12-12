import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import SpeechWithTitle from './SpeechWithTitle';


function SpeechScreen(props) {
  const { speechData } = props;
  if (speechData && speechData.title && speechData.text) {
    return (
      <SpeechWithTitle
        title={speechData.title}
        text={speechData.text}
        soundUrl={speechData.soundUrl}
      />
    );
  } else if (!speechData) {
    return <div>No data</div>;
  }
}

const mapStateToProps = (state) => ({
  speechData: state.robotWSDataReducer.apiSpeechData,
});

SpeechScreen.propTypes = {
  speechData: PropTypes.object,
};

export default compose(
  connect(mapStateToProps, null),
)(SpeechScreen);

