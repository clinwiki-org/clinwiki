/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'sanitize.css/sanitize.css';
import { BrowserRouter as Router } from 'react-router-dom';

import { ApolloProvider } from 'react-apollo';

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import '!file-loader?name=[name].[ext]!./images/icon-72x72.png';
import '!file-loader?name=[name].[ext]!./images/icon-96x96.png';
import '!file-loader?name=[name].[ext]!./images/icon-128x128.png';
import '!file-loader?name=[name].[ext]!./images/icon-144x144.png';
import '!file-loader?name=[name].[ext]!./images/icon-152x152.png';
import '!file-loader?name=[name].[ext]!./images/icon-192x192.png';
import '!file-loader?name=[name].[ext]!./images/icon-384x384.png';
import '!file-loader?name=[name].[ext]!./images/icon-512x512.png';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess';
import '!file-loader?name=[name].[ext]!./images/clinwiki-50.png';
import '!file-loader?name=[name].[ext]!./images/heading.png';
import 'react-toggle/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
/* eslint-enable import/no-unresolved, import/extensions */

import apolloClient from './configureApollo';

// Import i18n messages
import { translationMessages } from './i18n';

// Import CSS reset and Global Styles
import './global-styles';

const MOUNT_NODE = document.getElementById('app');

const alertOptions = {
  position: 'top right',
  theme: 'light',
  transition: 'scale',
  timeout: 5000,
  offset: '14',
};

const render = messages => {
  ReactDOM.render(
    <LanguageProvider messages={messages} locale="en">
      <Router>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </Router>
    </LanguageProvider>,
    MOUNT_NODE
  );
};

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept(['./i18n', 'containers/App'], () => {
    // @ts-ignore
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
// @ts-ignore
if (window && !window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
// if (process.env.NODE_ENV === 'production') {
//   require('offline-plugin/runtime').install(); // eslint-disable-line global-require
// }

// Explicitly uninstall serviceworker
if (process.env.NODE_ENV === 'production') {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const reg of registrations) {
        console.log('Unregistering service worker');
        reg.unregister();
      }
    });
  }
}
