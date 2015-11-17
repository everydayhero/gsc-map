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
    let { selectedId, data } = this.props
    return {
      currentPage: !!selectedId ? this.findDataPage(selectedId, data) : 0
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

    if (nextSelectedId || (nextFilterQuery !== currentFilterQuery)) {
      this.setState({
        currentPage: this.findDataPage(nextSelectedId, nextData || currentData)
      })
    }
  },

  findDataPage (datumId, data) {
    if (!datumId) return 0

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
    let { onSelect } = this.props

    onSelect && onSelect(page)
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
