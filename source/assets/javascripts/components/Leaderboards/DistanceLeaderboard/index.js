'use strict'

import React       from 'react'
import Leaderboard from '../Leaderboard'
import getJSON from 'hui/lib/getJSON'
import merge from 'lodash/object/merge'
import _ from 'lodash'

export default React.createClass({
  displayName: 'DistanceLeaderboard',

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

  componentDidMount: function() {
    let props = this.props
    getJSON(props.url, props.params).then(this.onSuccess, this.onFail)
  },

  onSuccess: function(response) {
    let data = response.results.map((result, index) => {
      let team = merge({}, result, result.team)
      team.id = team.team_page_id
      team.rank = index + 1
      team.distance_in_kms = team.distance_in_meters / 1000

      return team
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
      <div className="DistanceLeaderboard">
        <Leaderboard
          { ...this.props }
          { ...this.state }
          valueSymbol="km"
          valueType="distance"
          valueFormat="0.00"
          valuePath="distance_in_kms"/>
      </div>
    )
  }
})
