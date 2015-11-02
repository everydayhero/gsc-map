'use strict'

import React from 'react'
import classnames from 'classnames'
import GSCLeaderMap from './components/GSCLeaderMap'
import Leaderboards from './components/Leaderboards'

let campaignId = 'au-19283'
let domain = 'everydayhero.com'
let startAt = '2015-10-31T14:00:00Z'

let Example = React.createClass({
  getInitialState () {
    return {
      selectedTeam: ''
    }
  },

  handleTeamSelection (id) {
    this.setState({
      selectedTeam: id.toString()
    })
  },

  handleChange (e) {
    this.handleTeamSelection(e.target.value.toString())
  },

  onSelect (id) {
    let component = this
    id = id.toString()

    // Don't change id unless user really intented to
    clearTimeout(this.waitOut)
    this.waitOut = setTimeout(function() {
      component.setState({
        selectedTeam: id
      })
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

  render () {
    let { mapActive } = this.state
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
            selectedTeam={ this.state.selectedTeam }
            teamPageIds={ this.props.teamPageIds } />
        </div>
        <div className="panelWrap">
          <div className="panel">
            <h2 className="panel_header">Leaderboards</h2>
            <div className="panel_instructions">
              <p>As each team logs their rides, their marker will move along the course.</p>
              <p>Select a team to view their progress.</p>
            </div>
            <Leaderboards
              onSelect={ this.onSelect }
              onDeSelect={ this.onDeSelect }
              domain={ domain }
              campaignId={ campaignId }
              startAt={ startAt }
              teamPageIds={ this.props.teamPageIds } />
          </div>
        </div>
      </div>
    )
  }
})

window.renderTracker = function(id, teamPageIds) {
  teamPageIds = teamPageIds|| [];

  React.render(<Example teamPageIds={ teamPageIds }/>, document.getElementById(id))
}
