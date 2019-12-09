const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema Service
const ServiceSchema = new Schema({
  key: {
    type: String,
    unique: true,
    required: true
  },
  numberChar: {
    type: Number,
    default: 500000,
    min: 0
  },
  dueDate: {
    type: Date,
    default: new Date(+new Date() + 864e5 * 30)
  },
  numberUse: {
    type: Number,
    default: 0,
    min: 0
  },
  timeUse: {
    type: Number,
    default: 0,
    min: 0
  },

  createAt: {
    type: Date,
    default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  },
});

ServiceSchema
.virtual('expDate')
.get(function () {
    let day = this.dueDate.getDate();
    if (day < 10) day = "0" + day;
    let mon = this.dueDate.getMonth()+1;
    if (mon < 10) mon = "0" + mon;
    return day + '/' + mon + '/' + this.dueDate.getFullYear();
});


ServiceSchema
.methods.extendDueTime = function (id) {
  this.updateAt = new Date();

  if (id == 1) {
    this.numberChar = this.numberChar + 500000;  
  } else if (id == 2) {
    this.numberChar = this.numberChar + 4000000;
  } else if (id == 3) {
    this.numberChar = this.numberChar + 10000000;
  } else if (id == 0) { // Free pack
    return this;
  }
  if (this.dueDate > new Date()) this.dueDate = new Date(+this.dueDate + 864e5 * 30);
  else this.dueDate = new Date(+new Date() + 864e5 * 30);
  return this;
};

ServiceSchema
.statics.getSampleService = function (id) {
  let sampleService = new Service();
  if (id == 1) {
    sampleService.numberChar = 500000;
  } else if (id == 2) {
    sampleService.numberChar = 4000000;
  } else if (id == 3) {
    sampleService.numberChar = 10000000;
  } else if (id == 0) { // Free pack
    sampleService.numberChar = 200000;
    sampleService.dueDate = new Date(+new Date() + 864e5 * 15);
  }
  return sampleService;
};

module.exports = Service = mongoose.model("services", ServiceSchema);
