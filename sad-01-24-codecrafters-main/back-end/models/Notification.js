const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type:{
        type: String,
        enum:['Review','Rating',]
    },
    remarks:{
        type: String,
    },
    read:{
      type: Boolean,
      default:false
    }
  }, {
    timestamps: true,
  });

module.exports = mongoose.model('Notification', notificationSchema);

