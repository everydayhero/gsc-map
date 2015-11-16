'use strict'

import React from 'react'
import Leaderboard from 'hui/leaderboard'
import LeaderboardRow from 'hui/leaderboard/LeaderboardRow'
import Pagination from 'hui/navigation/Pagination'
import EmptyState from '../EmptyState'
import find from 'lodash/collection/find'

export default React.createClass({
  displayName: 'Leaderboard',

  propTypes: {
    onSelect: React.PropTypes.func,
    url: React.PropTypes.string
  },

  getInitialState: function() {
    var currentPage = 0
    let { selectedId, data } = this.props
    if (selectedId) {
      currentPage = this.findDataPage(selectedId, data)
    }
    return { currentPage }
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

  componentWillReceiveProps (nextProps) {
    let {
      data: nextData,
      filterQuery: nextFilterQuery,
      selectedId: nextSelectedId
    } = nextProps
    let {
      data: currentData,
      filterQuery: currentFilterQuery,
      selectedId: currentSelectedId
    } = this.props
    var { currentPage } = this.props
    currentPage = currentPage || 0

    if (nextSelectedId) {
      currentPage = this.findDataPage(nextSelectedId, nextData || currentData)
    }
    if (nextFilterQuery !== currentFilterQuery) {
      currentPage = this.findDataPage(currentSelectedId, nextData)
    }
    this.setState({ currentPage })
  },

  findDataPage (datumId, data) {
    let datum = find(data, (entity) => {
      return entity.id.toString() === datumId.toString()
    })
    let index = data.indexOf(datum)
    index = index !== -1 ? index : 0
    return Math.floor(index / 10)
  },

  onPage: function(increment) {
    let currentPage = this.state.currentPage + increment
    this.setState({ currentPage })
  },

  getPageData: function() {
    let { currentPage } = this.state
    let { data } = this.props
    let pageLength = 10
    let to = (pageLength * (currentPage + 1))
    let from = to - pageLength

    return data.slice(from, to)
  },

  onSelect: function(page) {
    let pageId = page.data.team_page_id
    let onSelect = this.props.onSelect

    if (page.data.owner_type === 'Team') {
      pageId = page.id
    }

    onSelect && onSelect(pageId)
  },

  renderLeaderboard: function() {
    let state = this.state
    let props = this.props

    if (!props.data.length) {
      return <EmptyState/>
    }

    return (
      <div className="Leaderboard__leaderboard">
        <Leaderboard
          {...state}
          {...props}
          onSelect={ this.onSelect }
          rowData={ this.getPageData() }
          rowComponent={ LeaderboardRow } />
          <div className="Leaderboard__pagination">
            <Pagination
              {...props}
              {...state}
              onChange={ this.onPage } />
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
