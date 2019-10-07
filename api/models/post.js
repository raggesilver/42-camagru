const mongoose  = require('mongoose');

const schema = new mongoose.Schema({
   user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
     media: { type: Array },
      text: { type: String },
     likes: [{
       user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
     }],
  comments: [ mongoose.Schema.Types.ObjectId ]
});

// schema.statics.generateVerificationCode = () => {
// };

// schema.methods.getPersonalData = function () {
// };

module.exports = mongoose.model('post', schema);
