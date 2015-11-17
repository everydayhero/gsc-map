'use strict'

import React from 'react'
import CampaignTracker from './components/CampaignTracker'
import Router from 'react-router'
import RouteHandler from './components/RouteHandler'

let Route = Router.Route
let NotFoundRoute = Router.NotFoundRoute
let routes = (
  <Route name="root" path="/" handler={ CampaignTracker }>
    <Route name="tracker" path="tracker" handler={ CampaignTracker }/>
    <Route name="team" path="tracker/team/:id" handler={ CampaignTracker }/>
    <Route name="individual" path="tracker/individual/:id" handler={ CampaignTracker }/>
    <NotFoundRoute handler={ RouteHandler } />
  </Route>
)

window.renderTracker = function(id, teamPageIds = [], highlightedCharity = '') {
  console.log('Highlighted: ', highlightedCharity)

  let router = Router.create({
    routes: routes,
    location: Router.HashLocation,
    scrollBehavior: {
      updateScrollPosition() {}
    }
  })

  router.run(function(Handler) {
    React.render(<Handler teamPageIds={ teamPageIds } highlightedCharity={ highlightedCharity } />, document.getElementById(id))
  })
}
