import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { ConnectedRouter } from 'connected-react-router';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from "redux-saga";
import { reducer as formReducer } from 'redux-form';

import './index.css';
import App from './App';

import { watchApp, watchAccount } from "./store/sagas";
import appReducer from "./store/reducers/app";
import accountReducer from "./store/reducers/account";
import * as serviceWorker from './serviceWorker';
require('dotenv').config();

const composeEnhancers = process.env.NODE_ENV === "development" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? 
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
  app: appReducer,
  account: accountReducer,
  form:formReducer,
});

const sagaMiddleware = createSagaMiddleware();

const history = createBrowserHistory();

const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancers(applyMiddleware(routerMiddleware(history),sagaMiddleware))
);

sagaMiddleware.run(watchApp);
sagaMiddleware.run(watchAccount);

const app = (
    <Provider store={store}>
      <ConnectedRouter history={history}> 
        <App />
      </ConnectedRouter> 
    </Provider>
  );

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();
