"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 50 },
    last_name: { type: String, required: true, maxLength: 50 },
    username: { type: String, required: true, maxLength: 200 },
    password: { type: String, required: true },
    messages: [{ type: Schema.Types.ObjectId, ref: "messages" }],
    membership: { type: Boolean, required: true },
    admin: { type: Boolean },
}, { collection: "users" });
module.exports = mongoose.model("User", UserSchema);
