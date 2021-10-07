// Import all the third party stuff
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'sanitize.css/sanitize.css';
import { BrowserRouter as Router } from 'react-router-dom';
import * as FullStory from '@fullstory/browser';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import sagas from './sagas';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import history from 'createHistory';

// Import root app
import App from 'containers/App';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import './images/favicon.ico';
import './images/icon-72x72.png';
import './images/icon-96x96.png';
import './images/icon-128x128.png';
import './images/icon-144x144.png';
import './images/icon-152x152.png';
import './images/icon-192x192.png';
import './images/icon-384x384.png';
import './images/icon-512x512.png';
import './manifest.json';
import './images/gold_star.png';
import './images/silver_star.png';
import './images/star_outline.png';
import './images/org_icons_membership.png';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { ProvideTheme } from 'containers/ThemeProvider/ThemeProvider';


// Import CSS reset and Global Styles
import GlobalStyle from './global-styles';

const orgId = process.env.REACT_APP_FULLSTORY_ID || 'Q5CJJ';

// FullStory.init({ orgId });

const MOUNT_NODE = document.getElementById('app');

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(rootReducer(history), composeWithDevTools(applyMiddleware(sagaMiddleware, routerMiddleware(history))));
sagaMiddleware.run(sagas);

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ProvideTheme>
          <GlobalStyle />
          <App />
        </ProvideTheme>
      </ConnectedRouter>
    </Provider>,
    MOUNT_NODE
  );
};

render();
