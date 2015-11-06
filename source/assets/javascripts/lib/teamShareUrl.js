export default (teamId) => {
  let { protocol, host } = location

  return `${ protocol }//${ host }/#/tracker/team/${ teamId }`
}
