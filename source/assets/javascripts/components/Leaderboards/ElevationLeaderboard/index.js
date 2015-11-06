'use strict'

import React from 'react'
import Leaderboard from '../Leaderboard'
import getJSON from 'hui/lib/getJSON'
import merge from 'lodash/object/merge'
import filterTeams from '../../../lib/filterTeams'
import _ from 'lodash'
import filterable from '../../../mixins/filterable'
import teamShareUrl from '../../../lib/teamShareUrl'

export default React.createClass({
  displayName: 'ElevationLeaderboard',

  mixins: [filterable],

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

  componentWillReceiveProps (nextProps) {
    if (nextProps.url === this.props.url) return

    this.setState({
      inProgress: true
    }, () => {
      getJSON(nextProps.url, this.props.params)
        .then(this.onSuccess, this.onFail)
    })
  },

  onSuccess: function(response) {
    let data = response.results.map((result, index) => {
      let entity = merge({}, result, result.team, result.page)
      entity.id = entity.team_page_id || ''
      entity.rank = index + 1
      entity.distance_in_kms = entity.distance_in_meters / 1000

      return entity
    }) || []

    data = filterTeams(this.props.teamPageIds, data)
    data = data.map(function(item, index) {
      item.rank = index + 1
      if (item.team_page_id) {
        item.share_url = teamShareUrl(item.team_page_id)
      }
      return item
    })
    let filteredData = this.filterByQuery(this.props.filterQuery, data, ['name'])

    this.setState({
      data,
      filteredData,
      inProgress: false,
      count: Math.ceil(filteredData.length / 10)
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
          data={ this.state.filteredData }
          valueSymbol="m"
          valueType="distance"
          valueFormat="0"
          valuePath="elevation_in_meters"/>
      </div>
    )
  }
})
