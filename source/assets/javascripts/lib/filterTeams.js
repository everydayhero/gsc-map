'use strict'
import _ from 'lodash'

export default function(teamPageIds, data) {
  if (!!teamPageIds.length) {
    data = _.filter(data, function(page) {
      let id = page.team_page_id || page.id

      return _.includes(teamPageIds, id.toString())
    });
  }

  return data;
}
