/*
* Bidirectional, with queue
*/

import { eventChannel, effects, delay } from 'redux-saga';
import { takeEvery, all } from 'redux-saga/effects'
import _ from 'lodash';
import { types, actionCreators } from './actions';
const { call, put, take, race, fork } = effects;


let pendingTasks = [];
let activeTasks = [];

function watchMessages(socket) {
  return eventChannel((emitter) => {
    socket.onopen = (e) => (emitter(actionCreators.socketOpen(e)));
    socket.onclose = (e) => (emitter(actionCreators.socketClose(e)));
    socket.onerror = (e) => (emitter(actionCreators.socketError(e)));
    socket.onmessage = (e) => (emitter(actionCreators.socketMessage(e)));

    return () => {
      socket.close();
    };
  });
}

function* internalListener(socket) {
  while (true) {
    const data = yield take(types.SOCKET_SEND);
    socket.send(data.payload);
  }
}

function* externalListener(socketChannel) {
  while (true) {
    const action = yield take(socketChannel);
    if (action.type === types.SOCKET_MESSAGE) {
      if (action.payload && action.payload.force && action.payload.force === 'true') {
        pendingTasks = [action];
      } else {
        pendingTasks = [...pendingTasks, action];
      }
    } else {
      yield put(action);
    }
  }
}

function* wsHandling(action) {
  const socket = action.payload.socket;
  while (true) {
    const socketChannel = yield call(watchMessages, socket);
    const { cancel } = yield race({
      task: all([call(externalListener, socketChannel), call(internalListener, socket)]),
      cancel: take(types.SOCKET_CLOSE),
    });
    if (cancel) {
      socketChannel.close();
    }
  }
}

function* tasksScheduler() {
  while (true) {
    const canDisplayTask = activeTasks.length < 1 && pendingTasks.length > 0;
    if (canDisplayTask) {
      const [firstTask, ...remainingTasks] = pendingTasks;
      pendingTasks = remainingTasks;
      yield fork(displayTask, firstTask);
      yield call(delay, 300);
    }
    else {
      yield call(delay, 50);
    }
  }
}

function getAudioDuration(soundUrl) {
  return new Promise(function(resolve) {
    const audio = new Audio(soundUrl);
    audio.onloadedmetadata = function () {
      resolve(audio.duration * 1000);
    };
  });
}

function* displayTask(task) {
  activeTasks = [...activeTasks, task];
  yield put(task);
  if (task.payload.channel === 'api-speech') {
    const duration = yield call(getAudioDuration, task.payload.soundUrl);
    yield call(delay, duration + 2000);
  }
  activeTasks = _.without(activeTasks, task); // Remove from active toasts
}

export default function* rootSaga(action) {
  yield all([
    takeEvery(types.SOCKET_CONNECT, wsHandling),
    takeEvery(types.SOCKET_CONNECT, tasksScheduler),
  ]);
}
