const mongoose  = require('mongoose');

const schema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
     media: { type: Array },
      text: { type: String },
     likes: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'user' },
  comments: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'comment' },
}, {
  timestamps: true
});

// schema.statics.generateVerificationCode = () => {
// };

// schema.methods.getPersonalData = function () {
// };

module.exports = mongoose.model('post', schema);
