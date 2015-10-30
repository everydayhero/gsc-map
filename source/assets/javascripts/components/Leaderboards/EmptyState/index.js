'use strict'

import React from 'react'
import Button from 'hui/buttons/Button'

export default React.createClass({
  displayName: 'EmptyState',

  render: function() {
    return (
      <div key="distance" className="Leaderboards__underConstruction">
        <h2 className="underConstruction__header">
          Official ride commences Nov 1st 2015
        </h2>
        <div className="underConstruction__cta">
          <Button kind="cta" href="https://greatsoutherncrossing.everydayhero.com/au/get-started">Register for free</Button>
        </div>
      </div>
    )
  }
})
