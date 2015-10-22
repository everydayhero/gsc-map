import React from 'react'
import classnames from 'classnames'
import merge from 'lodash/object/merge'
import RaceMap from '../RaceMap'
import routeString from '../../../data/route.js'
import 'es6-shim'
import 'whatwg-fetch'
import promise from 'es6-promise'
promise.polyfill()

const routeData = JSON.parse(routeString)

export default React.createClass({
  propTypes: {
    selectedTeam: React.PropTypes.string,
    onTeamSelection: React.PropTypes.func
  },

  defaultProps () {
    return {
      selectedTeam: '',
      onTeamSelection: () => {}
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
    fetch('assets/data/teams.json')
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.setState({
          teams: response.results.map((result) => {
            return merge({}, result, result.team)
          })
        })
      })
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
