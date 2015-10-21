import React from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import find from 'lodash/collection/find'
import Popup from './Popup'

const earthsRadiusInMeters = 6371000
const toRad = (value) => value * Math.PI / 180
const toDeg = (value) => value / Math.PI * 180

let racerIcon = L.divIcon({
  iconSize: new L.Point(36, 36),
  html: '<div class="gsc-Marker" />'
})

const NullRouteDatum = {
  totalDistance: 0,
  bearing: 0,
  point: [0, 0]
}

export default React.createClass({
  propTypes: {
    racers: React.PropTypes.array,
    route: React.PropTypes.array.isRequired,
    onRacerSelection: React.PropTypes.func
  },

  getDefaultProps () {
    return {
      racers: [],
      route: [],
      onRacerSelection: () => {}
    }
  },

  openPopup (marker) {
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
    this.openPopup(marker)
  },

  closePopup (marker) {
    let map = this.state.map
    let markers = this.state.markers
    let selectedMarker = this.state.selectedMarker
    map.off('popupclose', this.handlePopupClose)
    selectedMarker.clearLayers()
    markers.addLayer(marker)
    map.on('popupclose', this.handlePopupClose)
  },

  handlePopupClose (e) {
    let marker = e.popup._source
    this.closePopup(marker)
  },

  componentDidMount () {
    let mapContainer = this.refs.map.getDOMNode()
    let map = L.map(mapContainer)
    let markers = new L.MarkerClusterGroup({
      showCoverageOnHover: false,
      disableClusteringAtZoom: 9
    })
    map.addLayer(markers)
    let selectedMarker = L.featureGroup()
    map.addLayer(selectedMarker)

    this.setState({
      map,
      markers,
      selectedMarker
    }, () => {
      L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      }).addTo(map)
      map.on('popupopen', this.handlePopupOpen)
      map.on('popupclose', this.handlePopupClose)
      this.renderRoute()
      this.renderRacers(this.props.racers)
    })
  },

  shouldComponentUpdate () {
    return false
  },

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedRacer.toString() !== (this.state.selectedRacer && this.state.selectedRacer.toString())) {
      this.selectRacer(nextProps.selectedRacer)
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

  selectRacer (id) {
    let selectedRacer = this.state.selectedRacer
    let previousRacer = find(this.state.racers, (racer) => {
      return racer.id.toString() === (selectedRacer && selectedRacer.toString())
    })
    if (previousRacer) {
      previousRacer.marker.closePopup()
    }
    let racer = find(this.state.racers, racer => racer.id.toString() === id.toString())
    this.setState({
      selectedRacer: id
    }, () => {
      this.state.map.setView(racer.marker.getLatLng(), 10)
      racer.marker.openPopup()
    })
  },

  racersUpdated () {
    let selectedRacer = find(this.state.racers, (racer) => {
      return racer.id.toString() === (this.props.selectedRacer && this.props.selectedRacer.toString())
    })
    if (selectedRacer) {
      this.selectRacer(selectedRacer.id)
    } else {
      let points = this.state.racers.map((racer) => racer.marker.getLatLng())
      if (points.length) {
        this.state.map.fitBounds(points, {
          padding: [50, 50]
        })
      }
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
        let popup = this.renderPopup(racer)
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

  renderPopup (racer) {
    return React.renderToString(<Popup racer={ racer } />)
  },

  render () {
    return <div className="map gsc-MapContainer" ref="map" />
  }
})
