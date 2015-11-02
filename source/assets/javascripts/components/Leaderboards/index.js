'use strict'

import React from 'react'
import Tabs from 'hui/navigation/Tabs'
import RaisedLeaderboard from './RaisedLeaderboard'
import DistanceLeaderboard from './DistanceLeaderboard'
import ElevationLeaderboard from './ElevationLeaderboard'
import apiRoutes from '../../lib/apiRoutes'
import _ from 'lodash'

export default React.createClass({
  displayName: 'Leaderboards',

  getInitialState: function() {
    return {
      active: 0,
      currentPage: 0,
      count: 3
    }
  },

  getDefaultProps: function() {
    return {
      groupBy: 'teams',
      type: 'team',
      campaignId: 'au-6839',
      domain: 'everydayhero-staging.com',
      teamPageIds: [],
    }
  },

  getApiRoute (key, params) {
    return apiRoutes.get(key, params)
  },

  handleChange: function(active) {
    this.setState({
      active
    })
  },

  render: function() {
    let state = this.state
    let props = this.props
    let tabs = [
      {
        label: 'Raised',
        content: <RaisedLeaderboard
          key="raised"
          url={ this.getApiRoute('raised', props) }
          teamPageIds={ props.teamPageIds }
          onSelect={ props.onSelect }
          onDeSelect={ props.onDeSelect }/>
      },
      {
        label: 'Distance',
        content: <DistanceLeaderboard
          key="distance"
          url={ this.getApiRoute('distance', props) }
          teamPageIds={ props.teamPageIds }
          onSelect={ props.onSelect }
          onDeSelect={ props.onDeSelect }/>
      },
      {
        label: 'Elevation',
        content: <ElevationLeaderboard
          key="elevation"
          url={ this.getApiRoute('elevation', props) }
          teamPageIds={ props.teamPageIds }
          onSelect={ props.onSelect }
          onDeSelect={ props.onDeSelect }/>
      }
    ]

    return (
      <div className="Leaderboards">
        <Tabs onChange={ this.handleChange } active={ this.state.active } tabs={ tabs }/>
      </div>
    )
  }
})
