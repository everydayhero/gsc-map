'use strict'

import React from 'react'
import Tabs from 'hui/navigation/Tabs'
import RaisedLeaderboard from './RaisedLeaderboard'
import DistanceLeaderboard from './DistanceLeaderboard'
import ElevationLeaderboard from './ElevationLeaderboard'
import apiRoutes from '../../lib/apiRoutes'

export default React.createClass({
  displayName: 'Leaderboards',

  getInitialState: function() {
    return {
      filterQuery: '',
      active: 0
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

  handleChange: function(active) {
    this.setState({
      active
    })
  },

  render: function() {
    let state = this.state
    let {
      filterQuery,
      teamPageIds,
      highlightedCharity,
      selectedId,
      onSelect
    } = this.props

    let tabs = [
      {
        label: 'Raised',
        content: <RaisedLeaderboard
          key="raised"
          filterQuery={ filterQuery }
          url={ apiRoutes.get('raised', this.props) }
          teamPageIds={ teamPageIds }
          selectedId={ selectedId }
          highlightedCharity={ highlightedCharity }
          onSelect={ onSelect } />
      },
      {
        label: 'Distance',
        content: <DistanceLeaderboard
          key="distance"
          filterQuery={ filterQuery }
          url={ apiRoutes.get('distance', this.props) }
          teamPageIds={ teamPageIds }
          selectedId={ selectedId }
          highlightedCharity={ highlightedCharity }
          onSelect={ onSelect } />
      },
      {
        label: 'Elevation',
        content: <ElevationLeaderboard
          key="elevation"
          filterQuery={ filterQuery }
          url={ apiRoutes.get('elevation', this.props) }
          teamPageIds={ teamPageIds }
          selectedId={ selectedId }
          highlightedCharity={ highlightedCharity }
          onSelect={ onSelect } />
      }
    ]

    return (
      <div className="Leaderboards">
        <Tabs onChange={ this.handleChange } active={ this.state.active } tabs={ tabs }/>
      </div>
    )
  }
})
