// Import all the third party stuff
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'sanitize.css/sanitize.css';
import { BrowserRouter as Router } from 'react-router-dom';

import { ApolloProvider } from 'react-apollo';

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
import './images/clinwiki-50.png';
import './images/clinwiki-501.png';
import './images/gold_star.png';
import './images/silver_star.png';
import './images/star_outline.png';
import './images/heading.png';
// import 'react-toggle/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
/* eslint-enable import/no-unresolved, import/extensions */
import { ProvideTheme } from 'containers/ThemeProvider/ThemeProvider';

import apolloClient from './configureApollo';

// Import CSS reset and Global Styles
import GlobalStyle from './global-styles';

const MOUNT_NODE = document.getElementById('app');

const render = () => {
  ReactDOM.render(
    <Router>
      <ApolloProvider client={apolloClient}>
        <ProvideTheme>
          <GlobalStyle />
          <App />
        </ProvideTheme>
      </ApolloProvider>
    </Router>,
    MOUNT_NODE
  );
};

render();
