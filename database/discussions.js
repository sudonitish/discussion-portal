const mongoose = require('mongoose')
const { stringyfy } = require('querystring');

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const discussionSchema = new Schema({
  subject: String, // String is shorthand for {type: String}
  question: String,
  username:String,
  isFavorite: {
    type: Boolean,
    default: false
  },
  responses: [{ id: ObjectId, name: String, comment: String, upVote: Number, downVote: Number }]
}, { timestamps: true });
const discussionModel = mongoose.model('discussions', discussionSchema);
module.exports = discussionModel;