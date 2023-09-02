"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PasswordSchema = new Schema({
    password: { type: String, required: true, maxLength: 50 },
}, { collection: "password" });
PasswordSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/signup/${this._id}`;
});
module.exports = mongoose.model("Password", PasswordSchema);
