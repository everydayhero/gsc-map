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
      count: 3,
      filterQuery: ''
    }
  },

  getDefaultProps: function() {
    return {
      campaignId: 'au-6839',
      domain: 'everydayhero-staging.com',
      teamPageIds: [],
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
          filterQuery={ this.props.filterQuery }
          url={ apiRoutes.get('raised', props) }
          teamPageIds={ props.teamPageIds }
          onSelect={ props.onSelect }
          onDeSelect={ props.onDeSelect }/>
      },
      {
        label: 'Distance',
        content: <DistanceLeaderboard
          key="distance"
          filterQuery={ this.props.filterQuery }
          url={ apiRoutes.get('distance', props) }
          teamPageIds={ props.teamPageIds }
          onSelect={ props.onSelect }
          onDeSelect={ props.onDeSelect }/>
      },
      {
        label: 'Elevation',
        content: <ElevationLeaderboard
          key="elevation"
          filterQuery={ this.props.filterQuery }
          url={ apiRoutes.get('elevation', props) }
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
