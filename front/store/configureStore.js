import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers/index';
import rootSaga from '../sagas';

// custom middleware : action이 dispatch 되는 것들을 logging 해주는 middleware
const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action);
  return next(action);
};

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  // const middlewares = [sagaMiddleware, loggerMiddleware];
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(sagaMiddleware))
    : composeWithDevTools(applyMiddleware(sagaMiddleware, loggerMiddleware));
  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

const wrapper = createWrapper(configureStore, { 
  // debug가 true이면  Redux에 관해 자세한 설명이 나옴!
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;