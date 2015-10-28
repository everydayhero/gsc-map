'use strict'

import React       from 'react'
import Leaderboard from 'hui/leaderboard'
import LeaderboardRow from 'hui/leaderboard/LeaderboardRow'
import Pagination from 'hui/navigation/Pagination'
import EmptyState from '../EmptyState'

export default React.createClass({
  displayName: 'Leaderboard',

  propTypes: {
    onSelect: React.PropTypes.func,
    url: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      currentPage: 0
    }
  },

  getDefaultProps: function() {
    return {
      params: {},
      inProgress: true,
      count: 0,
      data: [],
      valueSymbol: '$',
      valueType: 'money'
    }
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

    return this.props.data.slice(from, to)
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
    let props = this.props

    if(props.data.length === 0) {
      return <EmptyState/>
    }

    return (
      <div className="Leaderboard__leaderboard">
        <Leaderboard
          {...state}
          {...this.props}
          onSelect={ this.onSelect }
          onDeSelect={ this.props.onDeSelect }
          selectedIndex={ this.props.selectedIndex }
          rowData={ this.getPageData() }
          rowComponent={ LeaderboardRow } />
          <div className="Leaderboard__pagination">
            <Pagination {...this.props} {...state} onChange={ this.onPage } />
          </div>
      </div>
    )
  },

  render: function() {
    let props = this.props

    return (
      <div className="Leaderboard">
        { props.inProgress && <div className="loadingIndicator"/> }
        { !props.inProgress && this.renderLeaderboard() }
      </div>
    )
  }
})
