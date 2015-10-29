'use strict'

import React from 'react'
import CampaignTracker from './components/CampaignTracker'
import Router from 'react-router'
import RouteHandler from './components/RouteHandler'
let Route = Router.Route;
let NotFoundRoute = Router.NotFoundRoute;

var router;

var routes = (
  <Route name="root" path="/" handler={ CampaignTracker }>
    <Route name="tracker" path="tracker" handler={ CampaignTracker } />
    <Route name="team" path="tracker/team/:teamId" handler={ CampaignTracker } />
    <NotFoundRoute handler={ RouteHandler } />
  </Route>
);

window.renderTracker = function(id, teamPageIds) {
  teamPageIds = teamPageIds|| [];

  router = Router.create({
    routes: routes,
    location: Router.HashLocation
  });

  router.run(function(Handler) {
    React.render(<Handler teamPageIds={ teamPageIds }/>, document.getElementById(id));
  });
}
