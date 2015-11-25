'use strict'

let api = {
  raised: '/json/{{ type }}_leaderboard.json',
  distance: '/json/{{ groupBy }}_distance.json',
  elevation: '/json/{{ groupBy }}_elevation.json'
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
