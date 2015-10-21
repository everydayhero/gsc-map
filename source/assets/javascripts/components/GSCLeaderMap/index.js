'use strict'
import React from 'react'
import merge from 'lodash/object/merge'
import RaceMap from '../RaceMap'
import routeData from '../../../data/route.json'
import 'whatwg-fetch'
import promise from 'es6-promise'
promise.polyfill()

import Leaderboard from 'hui/leaderboard'
import LeaderboardRow from 'hui/leaderboard/LeaderboardRow'
import Tabs from 'hui/navigation/Tabs'
import Pagination from 'hui/navigation/Pagination'
import getJSON from 'hui/lib/getJSON'

let api = {
  raised: 'https://everydayhero.com/api/v2/campaigns/{{ campaignId }}/leaderboard.json'
}

let getUrl = function(key, attibutes, params) {
  let address = api[key];

  for(let attibuteKey in attibutes) {
    address = address.replace('{{ ' + attibuteKey + ' }}', attibutes[attibuteKey])
  }

  return address
}

export default React.createClass({
  displayName: 'Leaderboard',

  getInitialState: function() {
    return {
      active: 0,
      currentPage: 0,
      count: 3,
      selectedIndex: null,
      inProgress: true
    }
  },

  handleChange: function(active) {
    this.setState({
      active
    })
  },

  onPage: function(increment) {
    let currentPage = this.state.currentPage + increment
    this.setState({ currentPage })
  },

  onSelect: function(item, index) {
    this.setState({
      selectedIndex: index
    })
  },

  render: function() {
    let state = this.state
    let tabs = [
      {
        label: 'Raise',
        content: (
          <div>
            { state.inProgress && 'loading...' }
            <Leaderboard
              onSelect={ this.onSelect }
              selectedIndex={ this.props.selectedIndex }
              rowData={ raisedData.leaderboard.pages }
              valueSymbol="$"
              valueType="money"
              rowComponent={ LeaderboardRow } />
            <Pagination {...state} onChange={ this.onPage } />
          </div>
        )
      },
      {
        label: 'Distance',
        content: (
          <div>
            { state.inProgress && 'loading...' }
            <Leaderboard
              onSelect={ this.onSelect }
              selectedIndex={ this.props.selectedIndex }
              rowData={ raisedData.leaderboard.pages }
              valueSymbol="$"
              valueType="money"
              rowComponent={ LeaderboardRow } />
            <Pagination {...state} onChange={ this.onPage } />
          </div>
        )
      },
      {
        label: 'Elevation',
        content: (
          <div>
           { state.inProgress && 'loading...' }
            <Leaderboard
              onSelect={ this.onSelect }
              selectedIndex={ this.props.selectedIndex }
              rowData={ raisedData.leaderboard.pages }
              valueSymbol="$"
              valueType="money"
              rowComponent={ LeaderboardRow } />
            <Pagination {...state} onChange={ this.onPage } />
          </div>
        )
      }
    ]

    return (
      <div>
        <h3 className="DemoPage__h3" id="Tabs">Tabs</h3>
        <Tabs onChange={ this.handleChange } active={ this.state.active } tabs={ tabs }/>
      </div>
    )
  }
})

