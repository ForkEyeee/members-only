"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    title: { type: String, required: true, maxLength: 50 },
    timestamp: { type: Date, required: true },
    text: { type: String, required: true, maxLength: 300 },
}, { collection: "messages" });
MessageSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/signup/${this._id}`;
});
module.exports = mongoose.model("Message", MessageSchema);
