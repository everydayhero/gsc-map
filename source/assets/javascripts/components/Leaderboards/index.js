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
      campaignId: 'au-6839',
      domain: 'everydayhero-staging.com'
    }
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
          url={ apiRoutes.get('raised', props) }
          onSelect={ props.onSelect }
          onDeSelect={ props.onDeSelect }/>
      },
      {
        label: 'Distance',
        content: <DistanceLeaderboard
          key="distance"
          url={ apiRoutes.get('distance', props) }
          onSelect={ props.onSelect }
          onDeSelect={ props.onDeSelect }/>
      },
      {
        label: 'Elevation',
        content: <ElevationLeaderboard
          key="elevation"
          url={ apiRoutes.get('elevation', props) }
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
