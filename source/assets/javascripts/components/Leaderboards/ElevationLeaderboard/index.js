'use strict'

import React       from 'react'
import Leaderboard from '../Leaderboard'
import getJSON from 'hui/lib/getJSON'
import merge from 'lodash/object/merge'
import filterTeams from '../../../lib/filterTeams'
import _ from 'lodash'

export default React.createClass({
  displayName: 'ElevationLeaderboard',

  propTypes: {
    onSelect: React.PropTypes.func,
    url: React.PropTypes.string,
    inProgress: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      params: {}
    }
  },

  getInitialState: function() {
    return {
      data: [],
      inProgress: true,
      count: 0
    }
  },

  componentDidMount: function() {
    let props = this.props
    getJSON(props.url, props.params).then(this.onSuccess, this.onFail)
  },

  onSuccess: function(response) {
    let data = response.results.map((result, index) => {
      let team = merge({}, result, result.team)
      team.id = team.team_page_id
      team.distance_in_kms = team.distance_in_meters / 100

      return team
    })

    data = data || []

    data = filterTeams(this.props.teamPageIds, data)

    data.forEach(function(item, index) {
      item.rank = index + 1
    })

    this.setState({
      data,
      inProgress: false,
      count: Math.ceil(data.length / 10)
    })
  },

  onFail: function(error) {
    this.setState({
      error,
      inProgress: false
    })
  },

  render: function() {
    return (
      <div className="ElevationLeaderboard">
        <Leaderboard
          { ...this.props }
          { ...this.state }
          valueSymbol="m"
          valueType="distance"
          valueFormat="0"
          valuePath="elevation_in_meters"/>
      </div>
    )
  }
})
