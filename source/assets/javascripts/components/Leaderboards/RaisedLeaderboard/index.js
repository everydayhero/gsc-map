'use strict'

import React       from 'react'
import Leaderboard from '../Leaderboard'
import getJSON from 'hui/lib/getJSON'
import filterTeams from '../../../lib/filterTeams'
import filterable from '../../../mixins/filterable'
import _ from 'lodash'

export default React.createClass({
  displayName: 'RaisedLeaderboard',

  mixins: [filterable],

  propTypes: {
    onSelect: React.PropTypes.func,
    url: React.PropTypes.string,
    inProgress: React.PropTypes.bool,
    teamPageIds: React.PropTypes.array
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
    let data = _.get(response, 'leaderboard.pages')
    let props = this.props

    data = filterTeams(this.props.teamPageIds, data)
    data = data.map(function(item, index) {
      item.rank = index + 1
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
      <div className="RaisedLeaderboard">
        <Leaderboard
          { ...this.props }
          { ...this.state }
          data={ this.state.filteredData } />
      </div>
    )
  }
})
