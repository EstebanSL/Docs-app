import { model, Schema } from "mongoose";

const DocumentSchema = new Schema({
  _id: String,
  title: String,
  content: Object,
  last_updated: Date,
});

export default module.exports = model("Document", DocumentSchema);
