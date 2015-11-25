'use strict'

let api = {
  raised: 'https://shared-scripts.s3.amazonaws.com/1.7.4-static/json/{{ type }}_leaderboard.json',
  distance: 'https://shared-scripts.s3.amazonaws.com/1.7.4-static/json/{{ groupBy }}_distance.json',
  elevation: 'https://shared-scripts.s3.amazonaws.com/1.7.4-static/json/{{ groupBy }}_elevation.json'
}

export default {
  get : function(key, attibutes) {
    let path = api[key] || '';
    for(let attibuteKey in attibutes) {
      path = path.replace('{{ ' + attibuteKey + ' }}', attibutes[attibuteKey])
    }

    return path
  }
}
