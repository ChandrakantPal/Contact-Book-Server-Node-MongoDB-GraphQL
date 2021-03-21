const { AuthenticationError, UserInputError } = require('apollo-server')

const Contact = require('../../models/Contact')
const checkAuth = require('../../utils/checkAuth')

module.exports = {
  Query: {
    async getContacts(_, __, context) {
      const user = checkAuth(context)
      try {
        const contacts = await Contact.find({ username: user.username }).sort({
          createdAt: -1,
        })
        return contacts
      } catch (error) {
        throw new Error(error)
      }
    },
    async searchContact(_, { searchfield }, context) {
      const user = checkAuth(context)

      try {
        const contactCount = await Contact.countDocuments({
          username: user.username,
          $or: [
            { contactname: { $regex: searchfield, $options: 'i' } },
            { contactemail: { $regex: searchfield, $options: 'i' } },
          ],
        })
        const contacts = await Contact.find({
          username: user.username,
          $or: [
            { contactname: { $regex: searchfield, $options: 'i' } },
            { contactemail: { $regex: searchfield, $options: 'i' } },
          ],
        })
        if (contacts) {
          return { contacts, contactCount }
        } else {
          throw new Error('Post not found')
        }
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Mutation: {
    async createContact(_, { contactname, contactemail }, context) {
      const user = checkAuth(context)
      // console.log(user);
      if (contactname.trim() === '' || contactemail.trim() === '') {
        throw new Error('contactname or contactemail must not be empty')
      }
      const contactCheck = await Contact.findOne({
        contactemail,
        username: user.username,
      })
      if (contactCheck) {
        throw new UserInputError('Contact already exist')
      }
      const newContact = new Contact({
        contactname,
        contactemail,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      })

      const contact = await newContact.save()

      return contact
    },
    async updateContact(_, { contactId, contactname, contactemail }, context) {
      const user = checkAuth(context)
      try {
        const contact = await Contact.findById(contactId)
        if (!contact) {
          throw new Error('Contact not found')
        }
        if (user.username !== contact.username) {
          throw new Error('This contact does not belong to your list')
        }
        if (contactname.trim() === '' || contactemail.trim() === '') {
          throw new Error('contactname or contactemail must not be empty')
        }
        contact.contactname = contactname
        contact.contactemail = contactemail
        const updatedContact = await contact.save()
        return updatedContact
      } catch (error) {
        throw new Error(error)
      }
    },
    async deleteContact(_, { contactId }, context) {
      const user = checkAuth(context)

      try {
        const contact = await Contact.findById(contactId)
        if (user.username === contact.username) {
          await contact.delete()
          return 'Contact deleted Sucessfully'
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
