'use strict'

import React from 'react'
import classnames from 'classnames'
import GSCLeaderMap from '../GSCLeaderMap'
import Leaderboards from '../Leaderboards'
import Router from 'react-router'
import scrollTo from '../../lib/scrollTo'
import _ from 'lodash'

const campaignId = 'au-19283'
const domain = 'everydayhero.com'
const startAt = '2015-10-31T14:00:00Z'

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
      show: 'teams',
      filterPrompt: 'Search for a team'
    }
  },

  handleMapSelection (newTeamId = '') {
    let { id } = this.getParams()
    let { teamId } = this.getQuery()
    let currentTeamId = this.state.show === 'teams' ? id : teamId

    if (currentTeamId === newTeamId.toString()) return

    if (newTeamId) {
      this.transitionTo('team', { id: newTeamId } )
    } else {
      this.transitionTo('tracker')
    }
  },

  handleMapFocusChange (activeState) {
    this.setState({
      mapActive: activeState
    })
  },

  isTeam(entity) {
    return entity.data.owner_type === 'Team' || !!entity.data.team
  },

  handleLeaderboardSelection (option) {
    if (this.isTeam(option)) {
      this.transitionTo('team', { id: option.id })
    } else {
      this.transitionTo('individual', { id: option.id }, { teamId: option.data.team_page_id })
    }
  },

  handleShowChange (e) {
    let show = e.target.value
    let showState = showMap[show]
    let filterPrompt = show === 'teams' ?
                        'Search for a team' :
                        'Search for an individual'

    !!showState && this.setState({
      ...showState,
      show,
      filterPrompt
    }, () => {
      this.transitionTo('tracker')
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

    let { id } = this.getParams()
    let { teamId } = this.getQuery()
    let selectedTeamId = teamId || id

    return (
      <div className="tracker">
        <div className={ mapWrapClasses }>
          <GSCLeaderMap
            domain={ domain }
            campaignId={ campaignId }
            startAt={ startAt }
            onFocusChange={ this.handleMapFocusChange }
            onTeamSelection={ this.handleMapSelection }
            selectedTeam={ selectedTeamId }
            highlightedCharity={ this.props.highlightedCharity }
            teamPageIds={ this.props.teamPageIds } />
        </div>
        <div className="panelWrap">
          <div className="panel">
            <h2 className="panel_header">Leaderboards</h2>
            <div className="panel_instructions">
              <p>Markers show where teams finished in<br/>the Great Southern Crossing.</p>
            </div>
            <div className="gsc-grid-container">
              <div className="gsc-grid-item gsc-grid-item--one-half">
                <div className="tracker__select">
                  <select
                    value={ this.state.show }
                    className="tracker__select-input"
                    onChange={ this.handleShowChange }>

                    <option value="teams">Teams</option>
                    <option value="individuals">Individuals</option>
                  </select>
                </div>
              </div>
              <div className="tracker__filter gsc-grid-item gsc-grid-item--one-half">
                <input
                  className="tracker__filter-input"
                  type="search"
                  onChange={ this.handleFilterChange }
                  placeholder={ this.state.filterPrompt } />
              </div>
            </div>
            <Leaderboards
              filterQuery={ this.state.filterQuery }
              onSelect={ this.handleLeaderboardSelection }
              selectedId={ id }
              highlightedCharity={ this.props.highlightedCharity }
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
