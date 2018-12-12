import { combineReducers } from 'redux';
import { types } from './actions';

const initialStateRobotWSData = {};

const robotWSDataReducer = (state = initialStateRobotWSData, action) => {
  switch (action.type) {
    case types.SOCKET_MESSAGE:
      if (action.payload.channel === 'api-speech') {
        return {
          ...state,
          'apiSpeechData': action.payload
        }   
      }
      return state;
    case types.CLEAN_SPEECH:
      return {
        ...state,
        'apiSpeechData': null
      }
    default:
      return state;
  }
}

export default combineReducers({
  robotWSDataReducer
 });