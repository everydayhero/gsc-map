import React from 'react'
import merge from 'lodash/object/merge'
import RaceMap from '../RaceMap'
import routeString from '../../../data/route.js'
import apiRoutes from '../../lib/apiRoutes'
import getJSON from 'hui/lib/getJSON'
import 'es6-shim'

const routeData = JSON.parse(routeString)

export default React.createClass({
  propTypes: {
    selectedTeam: React.PropTypes.string,
    onTeamSelection: React.PropTypes.func
  },

  getDefaultProps () {
    return {
      selectedTeam: '',
      onTeamSelection: () => {},
      campaignId: 'au-6839',
      domain: 'everydayhero-staging.com'
    }
  },

  getInitialState () {
    return {
      teams: []
    }
  },

  componentWillMount () {
    this.fetchTeams()
  },

  fetchTeams () {
    getJSON(apiRoutes.get('distance', this.props)).then(this.onSuccess, this.onFail)
  },

  onSuccess (response) {
    this.setState({
      teams: response.results.map((result) => {
        let team = merge({}, result, result.team)
        team.id = team.team_page_id

        return team
      })
    })
  },

  onFail (response) {

  },

  render () {
    return (
        !!this.state.teams.length &&
          <RaceMap
            route={ routeData }
            onRacerSelection={ this.props.onTeamSelection }
            selectedRacer={ this.props.selectedTeam }
            racers={ this.state.teams } />
    )
  }
})
