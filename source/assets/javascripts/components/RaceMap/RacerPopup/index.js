import React from 'react'
import HuiButton from 'hui/buttons/Button'
import HuiShare from 'hui/buttons/Share'
import numeric from 'hui/lib/numeric'

export default React.createClass({
  formatDistance (distance) {
    return Math.round(distance / 1000)
  },

  fundraisingToGo (team) {
    if(team.amount.cents >= team.target_cents) {
      return '0%'
    }

    return `${ 100 - ((100 / team.target_cents) * team.amount.cents) }%`
  },

  render () {
    let team = this.props.racer
    let { protocol, host } = location
    return (
      <div
        className="gsc-PopupContent">

        <header className="gsc-PopupContent__header">
          <div className="gsc-PopupContent__avatar">
            <img src={ team.image.medium_image_url } className="gsc-PopupContent__avatarImage"/>
          </div>
          <div className="gsc-PopupContent__summary">
            <h3 className="gsc-PopupContent__title">{ team.name }</h3>
            <div className="gsc-PopupContent__attribute-list">
              <div className="gsc-PopupContent__attribute">
                <span className="gsc-PopupContent__attribute-name">
                  has cycled
                </span>
                <span className="gsc-PopupContent__attribute-value">
                  { this.formatDistance(team.distance_in_meters) }km
                </span>
              </div>

              <div className="gsc-PopupContent__attribute">
                <span className="gsc-PopupContent__attribute-name">
                  for
                </span>
                <span className="gsc-PopupContent__attribute-value">
                  { team.charity_name }
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="gsc-PopupContent__progress">
          <div className="gsc-PopupContent__progress-bar">
            <div className="gsc-PopupContent__progress-meter" style={{
              right: this.fundraisingToGo(team)
            }} />
          </div>
          <div className="gsc-PopupContent__progress-summary">
            { numeric.money('$', team.amount.cents) } raised of { numeric.money('$', team.target_cents) }
          </div>
        </div>

        <div className="gsc-grid-container">
          <div className="gsc-grid-item gsc-grid-item--one-half">
            <HuiButton
              className="gsc-Popup__cta"
              icon="heart"
              href={ team.url }
              kind="cta">
              Give
            </HuiButton>
          </div>
          <div
            className="gsc-grid-item gsc-grid-item--one-half gsc-Popup__share-container"
            data-team-id={ team.id }>
            <HuiShare
              className="gsc-Popup__cta gsc-Popup__cta--share"
              label="Share"
              kind="facebook" />
          </div>
        </div>
      </div>
    )
  }
})
