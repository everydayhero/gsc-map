'use strict'

import React       from 'react'
import Leaderboard from 'hui/leaderboard'
import LeaderboardRow from 'hui/leaderboard/LeaderboardRow'
import Pagination from 'hui/navigation/Pagination'
import getJSON from 'hui/lib/getJSON'

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
      valueType: 'money'
    }
  },

  getDefaultProps: function() {
    return {
      params: {}
    }
  },

  componentDidMount: function() {
    getJSON(props.url, props.params).then(this.onSuccess, this.onFail)
  },

  onSuccess: function(data) {
    this.setState({
      data,
      inProgress: false,
      count: data.length
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
    let to = pageLength * state.currentPage
    let from = to - pageLength

    return state.data.splice(from, to)
  },

  onSelect: function(page) {
    var pageId = page.id
    if(page.owner_type === 'user') {
      pageId = page.team_page_id;
    }
  },

  renderLeaderboard: function() {
    let state = this.state

    return (
      <div>
        <Leaderboard
          {...state}
          onSelect={ this.onSelect }
          selectedIndex={ this.props.selectedIndex }
          rowData={ this.getPageData() }
          rowComponent={ LeaderboardRow } />
          <Pagination {...state} onChange={ this.onPage } />
      </div>
    )
  },

  render: function() {
    return (
      <div className="Leaderboard">
        { state.inProgress && 'loading...' }
        { !state.inProgress && this.renderLeaderboard() }
      </div>
    )
  }
})
