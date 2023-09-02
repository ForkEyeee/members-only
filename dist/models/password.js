"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PasswordSchema = new Schema({
    password: { type: String, required: true, maxLength: 50 },
}, { collection: "password" });
module.exports = mongoose.model("Password", PasswordSchema);
