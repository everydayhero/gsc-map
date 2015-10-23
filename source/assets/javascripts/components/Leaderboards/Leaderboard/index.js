'use strict'

import React       from 'react'
import Leaderboard from 'hui/leaderboard'
import LeaderboardRow from 'hui/leaderboard/LeaderboardRow'
import Pagination from 'hui/navigation/Pagination'
import getJSON from 'hui/lib/getJSON'
import _ from 'lodash'

export default React.createClass({
  displayName: 'Leaderboard',

  propTypes: {
    onSelect: React.PropTypes.func,
    url: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      currentPage: 0,
      inProgress: true,
      count: 0,
      data: [],
      valueSymbol: '$',
      valueType: 'money',
      dataPath: 'leaderboard.pages'
    }
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
    let data = _.get(response, this.state.dataPath)
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

  onPage: function(increment) {
    let currentPage = this.state.currentPage + increment
    this.setState({ currentPage })
  },

  getPageData: function() {
    let state = this.state
    let pageLength = 10
    let to = (pageLength * (state.currentPage + 1))
    let from = to - pageLength

    return state.data.slice(from, to)
  },

  onSelect: function(page) {
    let pageId = page.id
    let onSelect = this.props.onSelect

    if(page.owner_type === 'user') {
      pageId = page.team_page_id;
    }

    onSelect && onSelect(pageId)
  },

  renderLeaderboard: function() {
    let state = this.state

    return (
      <div className="Leaderboard__leaderboard">
        <Leaderboard
          {...state}
          onSelect={ this.onSelect }
          onDeSelect={ this.props.onDeSelect }
          selectedIndex={ this.props.selectedIndex }
          rowData={ this.getPageData() }
          rowComponent={ LeaderboardRow } />
          <div className="Leaderboard__pagination">
            <Pagination {...state} onChange={ this.onPage } />
          </div>
      </div>
    )
  },

  render: function() {
    let state = this.state

    return (
      <div className="Leaderboard">
        { state.inProgress && <div className="loadingIndicator"/> }
        { !state.inProgress && this.renderLeaderboard() }
      </div>
    )
  }
})
