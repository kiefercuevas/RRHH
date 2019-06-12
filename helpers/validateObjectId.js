const mongoose = require('mongoose');


function IsObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = IsObjectId;