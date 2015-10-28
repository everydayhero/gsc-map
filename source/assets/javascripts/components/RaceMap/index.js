import React from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'classlist-polyfill'
import find from 'lodash/collection/find'
import RacerPopup from './RacerPopup'
import WaypointPopup from './WaypointPopup'

const earthsRadiusInMeters = 6371000
const toRad = (value) => value * Math.PI / 180
const toDeg = (value) => value / Math.PI * 180

let racerIcon = L.divIcon({
  iconSize: new L.Point(36, 36),
  html: '<div class="gsc-Marker gsc-Marker--racer" />'
})

let waypointIcon = L.divIcon({
  iconSize: new L.Point(36, 36),
  html: '<div class="gsc-Marker gsc-Marker--waypoint" />'
})

const NullRouteDatum = {
  totalDistance: 0,
  bearing: 0,
  point: [0, 0]
}

export default React.createClass({
  propTypes: {
    hasFocus: React.PropTypes.bool,
    racers: React.PropTypes.array,
    route: React.PropTypes.array.isRequired,
    waypoints: React.PropTypes.array,
    onRacerSelection: React.PropTypes.func
  },

  getDefaultProps () {
    return {
      hasFocus: false,
      racers: [],
      route: [],
      waypoints: [],
      onRacerSelection: () => {}
    }
  },

  openRacerPopup (marker) {
    let map = this.state.map
    let popup = marker.getPopup()
    let px = map.project(popup._latlng)
    px.y -= popup._container.clientHeight / 2
    let markers = this.state.markers
    let selectedMarker = this.state.selectedMarker
    map.off('popupclose', this.handlePopupClose)
    map.off('popupopen', this.handlePopupOpen)
    markers.removeLayer(marker)
    selectedMarker.addLayer(marker)
    marker._icon.classList.add('gsc-MarkerContainer--selected')
    map.panTo(map.unproject(px))
    marker.openPopup()
    map.on('popupclose', this.handlePopupClose)
    map.on('popupopen', this.handlePopupOpen)
    this.setState({
      selectedRacer: marker.racer_id
    }, () => {
      this.props.onRacerSelection(marker.racer_id)
    })
  },

  handlePopupOpen (e) {
    let marker = e.popup._source

    if (marker.racer_id) {
      this.openRacerPopup(marker)
    }
  },

  closeRacerPopup (marker) {
    let map = this.state.map
    let markers = this.state.markers
    let selectedMarker = this.state.selectedMarker
    map.off('popupclose', this.handlePopupClose)
    selectedMarker.clearLayers()
    markers.addLayer(marker)
    let icon = marker._icon
    !!icon && icon.classList.remove('gsc-MarkerContainer--selected')
    map.on('popupclose', this.handlePopupClose)
  },

  handlePopupClose (e) {
    let marker = e.popup._source

    if (marker.racer_id) {
      this.closeRacerPopup(marker)
    }
  },

  componentDidMount () {
    let mapContainer = this.getDOMNode()
    let map = L.map(mapContainer)
    let waypoints = new L.FeatureGroup()
    map.addLayer(waypoints)
    let markers = new L.MarkerClusterGroup({
      showCoverageOnHover: false
    })
    map.addLayer(markers)
    let selectedMarker = L.featureGroup()
    map.addLayer(selectedMarker)

    this.setState({
      map,
      waypoints,
      markers,
      selectedMarker
    }, () => {
      L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      }).addTo(map)
      map.on('popupopen', this.handlePopupOpen)
      map.on('popupclose', this.handlePopupClose)
      this.renderRoute()
      this.renderWaypoints()
      if (this.props.racers.length) {
        this.renderRacers(this.props.racers)
      } else {
        let routePoints =  this.props.route.map(routeDatum => routeDatum.point)
        this.state.map.fitBounds(routePoints, {
          padding: [50, 50]
        })
      }
    })
  },

  shouldComponentUpdate () {
    return false
  },

  fitToRacers () {
    let points = this.state.racers.map((racer) => racer.marker.getLatLng())
    if (points.length) {
      this.state.map.fitBounds(points, {
        padding: [50, 50]
      })
    }
  },

  isSelectedRacer (id) {
    return id.toString() === (this.state.selectedRacer && this.state.selectedRacer.toString())
  },

  componentWillReceiveProps (nextProps) {
    if (nextProps.hasFocus !== this.props.hasFocus) {
      this.setFocus(nextProps.hasFocus)
    }

    if (!this.isSelectedRacer(nextProps.selectedRacer)) {
      this.selectRacer(nextProps.selectedRacer)
    }
  },

  getSelectedRacer () {
    return this.state.racers.find((racer) => {
      return this.isSelectedRacer(racer.id)
    })
  },

  setFocus (focus) {
    let { map } = this.state
    map.invalidateSize()
    let selectedRacer = this.getSelectedRacer()

    if (focus === true) {
      this.showRacer(selectedRacer, focus)
    } else {
      selectedRacer.marker.closePopup()
      this.fitToRacers()
    }
  },

  findRacerRouteStartingDatum (distance) {
    let routeData = this.props.route
    return routeData.find((datum, index) => {
      let next = routeData[index + 1]
      return (distance > datum.totalDistance) &&
        (distance < (next && next.totalDistance))
    }) || routeData[routeData.length - 1] || NullRouteDatum
  },

  calcRacerPosition (totalDistance) {
    let startDatum             = this.findRacerRouteStartingDatum(totalDistance)
    let currentBearingDistance = totalDistance - startDatum.totalDistance
    let point                  = startDatum.point
    let lat                    = toRad(point[0]) || 0
    let lon                    = toRad(point[1]) || 0
    let bearing                = toRad(startDatum.bearing) || 0
    let angularDistance        = currentBearingDistance / earthsRadiusInMeters

    let racerLat = Math.asin(
      Math.sin(lat) * Math.cos(angularDistance) +
      Math.cos(lat) * Math.sin(angularDistance) *
      Math.cos(bearing)
    )
    let racerLon = Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat),
      Math.cos(angularDistance) - Math.sin(lat) * Math.sin(racerLat)
    ) + lon

    return [toDeg(racerLat), toDeg(racerLon)]
  },

  showRacer (racer, focus) {
    if (!racer) return

    let marker = racer.marker

    console.log(racer)

    this.state.markers.zoomToShowLayer(marker, function () {
      if (focus) {
        marker.openPopup()
      } else {
        marker._icon.classList.add('gsc-MarkerContainer--selected')
      }
    })
  },

  selectRacer (id) {
    let previousRacer = this.getSelectedRacer()
    if (previousRacer) {
      previousRacer.marker.closePopup()
    }
    let racer = find(this.state.racers, racer => racer.id.toString() === id.toString())
    if (racer) {
      this.setState({
        selectedRacer: id
      }, () => {
        this.showRacer(racer, this.props.hasFocus)
      })
    }
  },

  racersUpdated () {
    let selectedRacer = this.getSelectedRacer()
    if (selectedRacer) {
      this.selectRacer(selectedRacer.id)
    } else {
      this.fitToRacers()
    }
  },

  renderRoute () {
    let routePoints = this.props.route.map((routeDatum) => {
      return routeDatum.point
    })
    L.polyline(routePoints, {
      color: '#4c80a5',
      opacity: 1,
      weight: 5
    }).addTo(this.state.map)
  },

  clearRenderedRacers () {
    this.state.markers.clearLayers()
  },

  renderRacers (racers) {
    this.setState({
      racers: racers.map((racer) => {
        let point = this.calcRacerPosition(racer.distance_in_meters)
        let popup = this.renderRacerPopup(racer)
        let marker = L.marker(point, { icon: racerIcon })
          .bindPopup(popup, {offset: new L.Point(0, -32)})
        marker.racer_id = racer.id
        this.state.markers.addLayer(marker)

        return {
          id: racer.id,
          marker
        }
      })
    }, this.racersUpdated)
  },

  renderWaypoints () {
    this.props.waypoints
      .filter((waypoint) => {
        return !(waypoint.name === 'Brisbane' || waypoint.name === "Perth")
      })
      .map((waypoint) => {
        let popup = this.renderWaypointPopup(waypoint)
        let marker = L.marker(waypoint.point, { icon: waypointIcon })
          .bindPopup(popup, {offset: new L.Point(0, -32)})
        this.state.waypoints.addLayer(marker)
      })
  },

  renderRacerPopup (racer) {
    return React.renderToString(<RacerPopup racer={ racer } />)
  },

  renderWaypointPopup (waypoint) {
    return React.renderToString(<WaypointPopup waypoint={ waypoint } />)
  },

  render () {
    return <div className="map gsc-MapContainer" />
  }
})
