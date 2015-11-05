'use strict'

import React from 'react'
import Button from 'hui/buttons/Button'

export default React.createClass({
  displayName: 'EmptyState',

  render: function() {
    return (
      <div key="distance" className="Leaderboards__underConstruction">
        <p className="underConstruction__header">
          <em>
            Sorry, no results match your search. <br />
            Please, try another search term.
          </em>
        </p>
      </div>
    )
  }
})
