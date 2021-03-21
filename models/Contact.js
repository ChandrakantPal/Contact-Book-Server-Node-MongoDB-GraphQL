const { model, Schema } = require('mongoose')

const contactSchema = new Schema({
  username: String,
  createdAt: String,
  contactname: String,
  contactemail: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
})

module.exports = model('Contact', contactSchema)
