import React from 'react'
import classnames from 'classnames'
import merge from 'lodash/object/merge'
import RaceMap from '../RaceMap'
import routeString from '../../../data/route.js'
import apiRoutes from '../../lib/apiRoutes'
import getJSON from 'hui/lib/getJSON'
import filterTeams from '../../lib/filterTeams'
import 'es6-shim'

const routeData = JSON.parse(routeString)
const bonusRouteData = []
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
      domain: 'everydayhero.com'
    }
  },

  getInitialState () {
    return {
      hideOverlay: false,
      inProgress: true,
      onFocusChange: () => {},
      teams: []
    }
  },

  componentWillMount () {
    this.fetchTeams()
  },

  fetchTeams () {
    let params = this.props
    params.groupBy = 'teams'
    getJSON(apiRoutes.get('distance', params)).then(this.onSuccess, this.onFail)
  },

  onSuccess (response) {
    let teams =  response.results.map((result) => {
        let team = merge({}, result, result.team)
        team.id = team.team_page_id

        return team
      })

    this.setState({
      inProgress: false,
      teams: filterTeams(this.props.teamPageIds, teams)
    })
  },

  onFail (response) {
    this.setState({
      inProgress: false
    })
  },

  handleOverlayClick () {
    this.props.onFocusChange(true)
    this.setState({
      hideOverlay: true
    })
  },

  handleOverlayCloseClick () {
    this.props.onFocusChange(false)
    this.setState({
      hideOverlay: false
    })
  },

  renderLegend () {
    const  { highlightedCharity } = this.props
    if (highlightedCharity || bonusRouteData.length) {
      return (
        <div className="GSCLeaderMap__legend">
          { !!highlightedCharity &&
            <div className="GSCLeaderMap__legend-item">
              <i className="GSCLeaderMap__highlight-icon" />
              Teams cycling for { this.props.highlightedCharity }
            </div> }
          { !!bonusRouteData.length &&
            <div className="GSCLeaderMap__legend-item">
              <svg
                className="GSCLeaderMap__path-indicator"
                viewBox="0 0 22 22" >
                <line
                  x1="5" y1="11"
                  x2="17" y2="11"
                  style={{
                    'stroke-linejoin': 'round',
                    'stroke-linecap': 'round',
                    'stroke': '#4c80a5',
                    'stroke-opacity': '1',
                    'stroke-width': '5',
                    'stroke-dasharray': '1.25 10',
                    'fill': 'none'
                  }} />
              </svg>
              Bonus route <strong>NEW!</strong>
            </div> }

        </div>
      )
    }
  },

  render () {
    let state = this.state
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
      <div>
        { state.inProgress && <div className={ classes }><div className="loadingIndicator"/></div> }
        { !state.inProgress &&
          (<div className={ classes }>
            <RaceMap
              hasFocus={ state.hideOverlay }
              route={ routeData }
              bonusRoute={ bonusRouteData }
              highlightedKey="charity_name"
              highlightedValue={ this.props.highlightedCharity }
              onRacerSelection={ this.props.onTeamSelection }
              selectedRacer={ this.props.selectedTeam }
              racers={ this.state.teams } />
            { this.renderLegend() }
            <button
              onClick={ this.handleOverlayCloseClick}
              className={ buttonClasses }>
              <i className="fa fa-close" />
            </button>
            <div
              onClick={ this.handleOverlayClick }
              className={ overlayClasses } />
          </div>) }
      </div>
    )
  }
})
