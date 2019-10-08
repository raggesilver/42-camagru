const mongoose  = require('mongoose');

const schema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
   text: { type: String },
  likes: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'user' },
}, {
  timestamps: true
});

// schema.statics.generateVerificationCode = () => {
// };

// schema.methods.getPersonalData = function () {
// };

module.exports = mongoose.model('comment', schema);
