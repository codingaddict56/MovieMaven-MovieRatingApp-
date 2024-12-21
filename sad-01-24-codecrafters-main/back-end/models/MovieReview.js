const mongoose = require('mongoose');

const movieReviewSchema = new mongoose.Schema({
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Movie',
    },
    // userId: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   minlength: 3,
    // },
    ratings:{
        type: Number,
        required: true
    },
    title:{
        type: String,
        required: true,
    },
    summary:{
      type: String,
    }
  }, {
    timestamps: true,
  });

module.exports = mongoose.model('MovieReview', movieReviewSchema);

