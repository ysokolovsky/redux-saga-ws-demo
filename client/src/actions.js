export const types = {
  SOCKET_OPEN: 'SOCKET_OPEN',
  SOCKET_CLOSE: 'SOCKET_CLOSE',
  SOCKET_ERROR: 'SOCKET_ERROR',
  SOCKET_MESSAGE: 'SOCKET_MESSAGE',
  SOCKET_CONNECT: 'SOCKET_CONNECT',
  SOCKET_SEND: 'SOCKET_SEND',
  CLEAN_SPEECH: 'CLEAN_SPEECH',
};

export const actionCreators = {
  socketOpen: e => ({ type: types.SOCKET_OPEN }),
  socketClose: e => ({ type: types.SOCKET_CLOSE }),
  socketError: err => ({ type: types.SOCKET_ERROR, payload: err }),
  socketMessage: e => ({ type: types.SOCKET_MESSAGE, payload: JSON.parse(e.data) }),
  cleanSpeech: e => ({ type: types.CLEAN_SPEECH }),
  socketConnect: socket => ({
    type: types.SOCKET_CONNECT,
    payload: {
      socket,
    },
  }),
  socketSend: msg => ({ type: types.SOCKET_SEND, payload: JSON.stringify(msg) }),
};

export const eventHandlers = {
  onopen: actionCreators.socketOpen,
  onclose: actionCreators.socketClose,
  onerror: actionCreators.socketError,
  onmessage: actionCreators.socketMessage,
  cleanchangescreen: actionCreators.cleanChangeScreen,
  cleanspeech: actionCreators.cleanSpeech,
};
