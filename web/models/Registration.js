const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema User
const SubscriptionSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    token: {
        type: String,
        required: false
    },
    activated: {
        type: Boolean,
        default: false
    },
    expired_in: {
        type: Date,
        default: null
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = Subscription = mongoose.model("subscription", SubscriptionSchema);
