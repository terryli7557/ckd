const {
  mongoose
} = require('./mongoose');

const Item = mongoose.model('Item', {
  order: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  desc: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    default: false,
    type: Boolean
  },
  createdAt: {
    type: Number
  }
});

module.exports = {
  Item
};
