'use strict'

import React from 'react'
import SelectInput from 'hui/forms/SelectInput'
import classnames from 'classnames'
import GSCLeaderMap from './components/GSCLeaderMap'
import Leaderboards from './components/Leaderboards'

const campaignId = 'au-19283'
const domain = 'everydayhero.com'
const startAt = '2015-10-20T14:00:00Z'

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

let Example = React.createClass({
  getInitialState () {
    return {
      selectedTeam: '',
      groupBy: 'teams',
      type: 'team',
      show: 'teams'
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

  handleShowChange (show) {
    let showState = showMap[show]

    !!showState && this.setState({
      ...showState,
      show
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
            selectedTeam={ this.state.selectedTeam } />
        </div>
        <div className="panelWrap">
          <div className="panel">
            <h2 className="panel_header">Leaderboards</h2>
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
