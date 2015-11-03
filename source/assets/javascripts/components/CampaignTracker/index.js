'use strict'

import React from 'react'
import classnames from 'classnames'
import GSCLeaderMap from '../GSCLeaderMap'
import Leaderboards from '../Leaderboards'
import Router from 'react-router'
import scrollTo from '../../lib/scrollTo'
import SelectInput from 'hui/forms/SelectInput'

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
    this.scrollTo()
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

  handleShowChange (show) {
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

  render () {
    let { mapActive, show, groupBy, type } = this.state
    let mapWrapClasses = classnames({
      'mapWrap': true,
      'mapWrap--active': !!mapActive
    })

    return (
      <div className="tracker">
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
              <SelectInput
                onChange={ this.handleShowChange }
                spacing="compact"
                label="Show"
                value={ show }
                options={[
                  { value: 'teams', label: 'Teams' },
                  { value: 'individuals', label: 'Individuals' }
                ]} />
            </div>
            <Leaderboards
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
