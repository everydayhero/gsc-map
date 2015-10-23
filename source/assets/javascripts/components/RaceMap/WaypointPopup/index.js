import React from 'react'

export default React.createClass({
  propTypes: {
    waypoint: React.PropTypes.object.isRequired
  },
  render () {
    console.log(this.props.waypoint)
    return (
      <div className="gsc-PopupContent">
        <img className="gsc-PopupContent__img" src={ this.props.waypoint.image_url } />
      </div>
    )
  }
})
