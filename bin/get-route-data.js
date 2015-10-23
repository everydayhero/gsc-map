'use strict'

const fs = require('fs')
const http = require('http')
const polyline = require('polyline')
const earthsRadiusInMeters = 6371000

function toRad (value) {
  return value * Math.PI / 180
}

function toDeg (value) {
  return value / Math.PI * 180
}

function calcBearing (pointA, pointB) {
  if (!(pointA && pointB)) { return 0 }

  let latA = toRad(pointA[0])
  let lonA = toRad(pointA[1])
  let latB = toRad(pointB[0])
  let lonB = toRad(pointB[1])
  let deltaLon = lonB - lonA
  let x = Math.cos(latB) * Math.sin(deltaLon)
  let y = Math.cos(latA) * Math.sin(latB) -
          Math.sin(latA) * Math.cos(latB) *
          Math.cos(deltaLon)

  return (toDeg(Math.atan2(x, y)) + 360) % 360
}

function calcDistance (pointA, pointB) {
  if (!(pointA && pointB)) { return 0 }

  let latA = toRad(pointA[0])
  let lonA = toRad(pointA[1])
  let latB = toRad(pointB[0])
  let lonB = toRad(pointB[1])
  let deltaLon = lonB - lonA

  return Math.acos(
    Math.sin(latA) * Math.sin(latB) +
    Math.cos(latA) * Math.cos(latB) *
    Math.cos(deltaLon)
  ) * earthsRadiusInMeters
}

function transformPoint (point, index, points, totalDistance) {
  if (!point) return {}

  let current  = point
  let next     = points[index + 1]
  let previous = points[index - 1]

  let distance = calcDistance(previous, current)
  let bearing  = calcBearing(current, next)

  return {
    point: current,
    distance: distance,
    bearing: bearing
  }
}

function pointsToDecimal (point) {
  return [point[0] / 10, point[1] / 10]
}

function processResult (result) {
  var totalDistance = 0

  return polyline.decode(result.route_geometry)
    .map(pointsToDecimal)
    .map(function (point, index, points) {
      let transformed = transformPoint(point, index, points)
      totalDistance += transformed.distance
      transformed.totalDistance = totalDistance
      return transformed
    })
}

function handleResponse (response) {
  var result = ''

  response.on('data', function (chunk) {
    result += chunk
  })

  response.on('end', function () {
    let content = `export default '${
      JSON.stringify(processResult(JSON.parse(result)))
    }'`;

    fs.writeFile(
      './source/assets/data/route.js',
      content,
      function (err) {
        if (err) { throw new Error(err) }

        process.exit(0)
      }
    )
  })
}

/*
Brisbane -27.465245, 153.028644
Grahamstown Lake -32.728199, 151.784682
Sydney -33.852333, 151.210812
Colo Vale -34.387102, 150.522240
Dog on the Tucker Box -35.001152, 148.110883
Chiltern -36.139044, 146.645555
Melbourne -37.817644, 144.967105
Ararat -37.282489, 142.931815
Serviceton -36.357478, 141.083789
St Ives -35.109216, 138.975806
Adelaide -34.940222, 138.624434
Port Pirie -33.184856, 138.021394
Penong -31.928627, 133.012377
Eyre Highway -31.611057, 129.720238
Mundrabilla -31.818328, 128.225760
Caiguna -32.269366, 125.487190
Fraser Range -32.057720, 122.994989
Lake Lefroy -31.445026, 121.563910
Southern Cross -31.233382, 119.329575
Meenar -31.635410, 116.891687
Perth -31.953573, 115.857006
*/

let options = {
  host: 'api-osrm-routed-production.tilestream.net',
  path: (`/viaroute?z=12
    &loc=-27.465245,153.028644
    &loc=-32.728199,151.784682
    &loc=-33.852333,151.210812
    &loc=-34.387102,150.522240
    &loc=-35.001152,148.110883
    &loc=-36.139044,146.645555
    &loc=-37.817644,144.967105
    &loc=-37.282489,142.931815
    &loc=-36.357478,141.083789
    &loc=-35.109216,138.975806
    &loc=-34.940222,138.624434
    &loc=-33.184856,138.021394
    &loc=-31.928627,133.012377
    &loc=-31.611057,129.720238
    &loc=-31.818328,128.225760
    &loc=-32.269366,125.487190
    &loc=-32.057720,122.994989
    &loc=-31.445026,121.563910
    &loc=-31.233382,119.329575
    &loc=-31.635410,116.891687
    &loc=-31.953573,115.857006`).replace(/\n|\s/g, '')
}

http.request(options, handleResponse).end()
