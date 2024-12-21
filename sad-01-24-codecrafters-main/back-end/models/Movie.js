const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieId: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,

    },
    releaseDate: {
        type: Date,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    cast: {
        type: String,
        required: true,
    },
    synopsis: {
        type: String,
        required: true,
    },
    duration:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true
    },
    video:{
        type: String,
        required: true,
    }
  },
   {
    timestamps: true,
  });

module.exports = mongoose.model('Movie', movieSchema);

