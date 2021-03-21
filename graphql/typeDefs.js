const { gql } = require('apollo-server')

module.exports = gql`
  type Contact {
    id: ID!
    createdAt: String!
    username: String!
    contactname: String!
    contactemail: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  type SearchedContacts {
    contacts: [Contact]!
    contactCount: Int!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getContacts: [Contact]!
    searchContact(searchfield: String!): SearchedContacts!
    login(username: String!, password: String!): User!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    createContact(contactname: String!, contactemail: String!): Contact!
    updateContact(
      contactId: ID!
      contactname: String!
      contactemail: String!
    ): Contact!
    deleteContact(contactId: ID!): String!
  }
`
