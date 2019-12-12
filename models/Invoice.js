const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema Invoice
const InvoiceSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  numberPhone: {
    type: String,
    require: true
  }, 
  cardName: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  expire: {
    type: Date,
    require: true
  },
  cvv: {
    type: String,
    required: true
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

module.exports = Invoice = mongoose.model("invoices", InvoiceSchema);
