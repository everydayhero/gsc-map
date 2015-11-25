'use strict'

let api = {
  raised: 'https://{{ domain }}/api/v2/campaigns/{{ campaignId }}/leaderboard.jsonp?type={{ type }}&limit=500&include_pages=true',
  distance: 'https://{{ domain }}/api/v2/search/fitness_activities_totals.jsonp?limit=500&type=bike&group_by={{ groupBy }}&sort_by=distance_in_meters&campaign_id={{ campaignId }}&start_at={{ startAt }}&end_at={{ endAt }}',
  elevation: 'https://{{ domain }}/api/v2/search/fitness_activities_totals.jsonp?limit=500&type=bike&group_by={{ groupBy }}&sort_by=elevation_in_meters&campaign_id={{ campaignId }}&start_at={{ startAt }}&end_at={{ endAt }}'
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
