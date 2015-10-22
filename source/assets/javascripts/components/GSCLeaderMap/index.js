import React from 'react'
import classnames from 'classnames'
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
      hideOverlay: false,
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

  handleOverlayClick () {
    this.setState({
      hideOverlay: true
    })
  },

  handleOverlayCloseClick () {
    this.setState({
      hideOverlay: false
    })
  },

  render () {
    let overlayClasses = classnames({
      'GSCLeaderMap__overlay': true,
      'GSCLeaderMap__overlay--closed': !!this.state.hideOverlay
    })

    let buttonClasses = classnames({
      'GSCLeaderMap__close-overlay': true,
      'GSCLeaderMap__close-overlay--hidden': !this.state.hideOverlay
    })

    let classes = classnames({
      'GSCLeaderMap': true,
      'GSCLeaderMap--overlay-open': !this.state.hideOverlay
    })

    return (
      !!this.state.teams.length &&
        (<div className={ classes }>
          <RaceMap
            route={ routeData }
            onRacerSelection={ this.props.onTeamSelection }
            selectedRacer={ this.props.selectedTeam }
            racers={ this.state.teams } />
          <button
            onClick={ this.handleOverlayCloseClick}
            className={ buttonClasses }>
            <i className="fa fa-close" />
          </button>
          <div
            onClick={ this.handleOverlayClick }
            className={ overlayClasses } />
        </div>)
    )
  }
})
