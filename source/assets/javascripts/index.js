'use strict'

import React from 'react'
import classnames from 'classnames'
import GSCLeaderMap from './components/GSCLeaderMap'
import Leaderboards from './components/Leaderboards'

let campaignId = 'au-19283'
let domain = 'everydayhero.com'
let startAt = '2015-09-30T14:00:00Z'

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

    if(!component.state.selectedTeam) {
      this.setState({
        selectedTeam: id
      })

      return
    }

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
            selectedTeam={ this.state.selectedTeam } />
        </div>
        <div className="panelWrap">
          <div className="panel">
            <h2 className="panel_header">Leaderboards</h2>
            <Leaderboards
              onSelect={ this.onSelect }
              onDeSelect={ this.onDeSelect }
              domain={ domain }
              campaignId={ campaignId }
              startAt={ startAt } />
          </div>
        </div>
      </div>
    )
  }
})

window.renderTracker = function(id) {
  React.render(<Example />, document.getElementById(id))
}
