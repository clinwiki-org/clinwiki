// Import all the third party stuff
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'sanitize.css/sanitize.css';
import { BrowserRouter as Router } from 'react-router-dom';

import { ApolloProvider } from 'react-apollo';
import * as FullStory from '@fullstory/browser';

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
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { ProvideTheme } from 'containers/ThemeProvider/ThemeProvider';

import apolloClient from './configureApollo';

// Import CSS reset and Global Styles
import GlobalStyle from './global-styles';

const orgId = process.env.REACT_APP_FULLSTORY_ID || 'Q5CJJ';

FullStory.init({ orgId });

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
