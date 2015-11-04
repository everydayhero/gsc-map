'use strict'

import React from 'react'
import classnames from 'classnames'
import GSCLeaderMap from '../GSCLeaderMap'
import Leaderboards from '../Leaderboards'
import Router from 'react-router'
import scrollTo from '../../lib/scrollTo'
import SelectInput from 'hui/forms/SelectInput'
import _ from 'lodash'

const campaignId = 'au-6839'
const domain = 'everydayhero-staging.com'
const startAt = '2015-09-30T14:00:00Z'

const showMap = {
  individuals: {
    groupBy: 'pages',
    type: 'individual'
  },
  teams: {
    groupBy: 'teams',
    type: 'team'
  }
}

export default React.createClass({
  mixins: [Router.State, Router.Navigation],

  componentDidMount () {
    this.scrollTo();
    this.scrollToMap();
  },

  componentWillReceiveProps () {
    this.scrollTo()
  },

  scrollTo () {
    let params = this.getParams() || {}
    if(params.splat) {
      scrollTo(params.splat)
    }
  },

  scrollToMap () {
    if(_.includes(this.getPathname(), 'tracker')) {
      scrollTo('tracker')
    }
  },

  getInitialState () {
    return {
      mapActive: false,
      groupBy: 'teams',
      type: 'team',
      show: 'teams'
    }
  },

  handleTeamSelection (id = '') {
    this.transitionTo('team', { teamId: id } )
  },

  handleChange (e) {
    this.handleTeamSelection(e.target.value.toString())
  },

  onSelect (id) {
    id = id || ''
    let component = this
    id = id.toString()
    // Don't change id unless user really intended to
    clearTimeout(this.waitOut)
    this.waitOut = setTimeout(function() {
      component.transitionTo('team', {teamId: id} )
    }, 300)
  },

  onDeSelect () {
    clearTimeout(this.waitOut)
  },

  handleMapFocusChange (activeState) {
    this.setState({
      mapActive: activeState
    })
  },

  handleShowChange (e) {
    let show = e.target.value
    let showState = showMap[show]

    !!showState && this.setState({
      ...showState,
      show
    }, () => {
      if (show === 'individuals') {
        this.transitionTo('tracker')
      }
    })
  },

  handleFilterChange (e) {
    this.setState({
      filterQuery: e.target.value
    })
  },

  render () {
    let { mapActive, show, groupBy, type } = this.state
    let mapWrapClasses = classnames({
      'mapWrap': true,
      'mapWrap--active': !!mapActive
    })

    return (
      <div className="tracker" id="tracker">
        <div className={ mapWrapClasses }>
          <GSCLeaderMap
            domain={ domain }
            campaignId={ campaignId }
            startAt={ startAt }
            onFocusChange={ this.handleMapFocusChange }
            onTeamSelection={ this.handleTeamSelection }
            selectedTeam={ this.getParams().teamId }
            teamPageIds={ this.props.teamPageIds } />
        </div>
        <div className="panelWrap">
          <div className="panel">
            <h2 className="panel_header">Leaderboards</h2>
            <div className="panel_instructions">
              <p>As each team logs their rides, their marker will move along the course.</p>
              <p>Select a team to view their progress.</p>
            </div>
            <div className="tracker__select">
              <select onChange={ this.handleShowChange }>
                <option value="teams">Teams</option>
                <option value="individuals">Individuals</option>
              </select>
            </div>
            <div className="tracker__filter">
              <input
                className="tracker__filter-input"
                type="search"
                onChange={ this.handleFilterChange }
                placeholder="Search for a team name" />
            </div>
            <Leaderboards
              filterQuery={ this.state.filterQuery }
              onSelect={ this.onSelect }
              onDeSelect={ this.onDeSelect }
              domain={ domain }
              groupBy={ groupBy }
              type={ type }
              campaignId={ campaignId }
              startAt={ startAt }
              teamPageIds={ this.props.teamPageIds } />
          </div>
        </div>
      </div>
    )
  }
})
