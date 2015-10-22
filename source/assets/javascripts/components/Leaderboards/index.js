'use strict'

import React from 'react'
import Tabs from 'hui/navigation/Tabs'
import Button from 'hui/buttons/Button'
import Leaderboard from './Leaderboard'
import apiRoutes from '../../lib/apiRoutes'
import _ from 'lodash'

export default React.createClass({
  displayName: 'Leaderboards',

  getInitialState: function() {
    return {
      active: 0,
      currentPage: 0,
      count: 3
    }
  },

  getDefaultProps: function() {
    return {
      campaignId: 'au-6839',
      domain: 'everydayhero-staging.com'
    }
  },

  handleChange: function(active) {
    this.setState({
      active
    })
  },

  render: function() {
    let state = this.state
    let props = this.props
    let underConstruction = (
          <div key="distance" className="Leaderboards__underConstruction">
            <h2 className="underConstruction__header">
              Official ride commences Nov 1st 2015
            </h2>
            <div className="underConstruction__cta">
              <Button kind="cta" href="https://greatsoutherncrossing.everydayhero.com/au/get-started">Sign Up</Button>
            </div>
          </div>
        )

    let tabs = [
      {
        label: 'Raised',
        content: <Leaderboard key="raised" url={ apiRoutes.get('raised', props) } onSelect={ props.onSelect } onDeSelect={ props.onDeSelect }/>
      },
      {
        label: 'Distance',
        content: underConstruction
      },
      {
        label: 'Elevation',
        content: underConstruction
      }
    ]

    return (
      <div className="Leaderboards">
        <Tabs onChange={ this.handleChange } active={ this.state.active } tabs={ tabs }/>
      </div>
    )
  }
})
