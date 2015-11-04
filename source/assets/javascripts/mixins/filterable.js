import React from 'react'

export default {
  propTypes: {
    filterQuery: React.PropTypes.string
  },

  getInitialState () {
    return {
      filteredData: []
    }
  },

  getDefaultProps () {
    return {
      filterQuery: ''
    }
  },

  componentWillReceiveProps (newProps) {
    if (newProps.filterQuery !== this.props.filterQuery) {
      let filteredData = this.filterByQuery(newProps.filterQuery, this.state.data, ['name'])
      this.setState({
        filteredData,
        count: Math.ceil(filteredData.length / 10)
      })
    }
  },

  filterByQuery (queryString, collection, properties) {
    const query   = new RegExp(queryString.split('').join('.*'), 'gi')
    return collection.filter((item) => {
      return properties.some((property) => {
        return !!item[property] && item[property].match(query)
      })
    })
  }
}
