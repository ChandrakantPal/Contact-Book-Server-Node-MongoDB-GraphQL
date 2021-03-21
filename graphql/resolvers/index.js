const contactResolvers = require('./contacts')
const usersResolvers = require('./users')

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...contactResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...contactResolvers.Mutation,
  },
}
