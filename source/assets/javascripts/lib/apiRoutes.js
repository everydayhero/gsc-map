'use strict'

let api = {
  raised: 'https://{{ domain }}/api/v2/campaigns/{{ campaignId }}/leaderboard.jsonp?type=&limit=200&include_pages=true',
  distance: 'https://{{ domain }}/api/v2/search/fitness_activities_totals.jsonp?limit=200&type=bike&group_by=teams&sort_by=distance_in_meters&campaign_id={{ campaignId }}&start_at={{ startAt }}',
  elevation: 'https://{{ domain }}/api/v2/search/fitness_activities_totals.jsonp?limit=200&type=bike&group_by=teams&sort_by=elevation_in_meters&campaign_id={{ campaignId }}&start_at={{ startAt }}'
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
