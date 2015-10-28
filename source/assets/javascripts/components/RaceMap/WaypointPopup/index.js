import React from 'react'

export default React.createClass({
  propTypes: {
    waypoint: React.PropTypes.object.isRequired
  },
  render () {
    return (
      <div className="gsc-PopupContent gsc-PopupContent--waypoint">
        <img className="gsc-PopupContent__img" src={ this.props.waypoint.image_url } />
      </div>
    )
  }
})
