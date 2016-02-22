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
const startAt = '2016-10-31T14:00:00Z'
const endAt = '2016-11-28T14:00:00Z'

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
            endAt={ endAt }
            onFocusChange={ this.handleMapFocusChange }
            onTeamSelection={ this.handleMapSelection }
            selectedTeam={ selectedTeamId }
            highlightedCharity={ this.props.highlightedCharity }
            teamPageIds={ this.props.teamPageIds } />
        </div>
      </div>
    )
  }
})
