/*
* Simple version without queue
*/

import { eventChannel, effects } from 'redux-saga';
import { takeEvery, all } from 'redux-saga/effects'
import { types, actionCreators } from './actions';
const { call, put, take } = effects;

function initWebsocket(socket) {
  return eventChannel(emitter => {
    socket.onopen = (e) => (emitter(actionCreators.socketOpen(e)));
    socket.onclose = (e) => (emitter(actionCreators.socketClose(e)));
    socket.onerror = (e) => (emitter(actionCreators.socketError(e)));
    socket.onmessage = (e) => (emitter(actionCreators.socketMessage(e)));

    return () => {
      socket.close();
    };
  })
}
function* wsSagas(action) {
  const socket = action.payload.socket;
  const channel = yield call(initWebsocket, socket)
  while (true) {
      const action = yield take(channel)
      yield put(action)
    }
}

export default function* rootSaga(action) {
  yield all([
    takeEvery(types.SOCKET_CONNECT, wsSagas),
  ]);
}
