const mongoose  = require('mongoose');

const schema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
     text: { type: String },
    likes: [{
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
    }],
});

// schema.statics.generateVerificationCode = () => {
// };

// schema.methods.getPersonalData = function () {
// };

module.exports = mongoose.model('comment', schema);
