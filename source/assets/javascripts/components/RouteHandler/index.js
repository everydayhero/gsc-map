'use strict';

var React        = require('react');
var Router       = require('react-router');
var RouteHandler = Router.RouteHandler;

module.exports = React.createClass({
  displayName: 'RouteHandler',

  render: function() {
    return <RouteHandler {...this.props} />;
  }
});
