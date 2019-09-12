import React from 'react';
import PropTypes from 'prop-types';
const rrd = require('react-router-dom');
// Just render plain div with its children
rrd.BrowserRouter = ({ children }) => (<div>{children}</div>);
rrd.BrowserRouter.propTypes = {
  ...rrd.BrowserRouter.PropTypes,
  children: PropTypes.node,
};
export default rrd;
