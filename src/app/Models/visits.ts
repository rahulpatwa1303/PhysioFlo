import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  doctor_email: { type: String, required: true },
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  address: { type: String },
  visit_timing: { type: String },
  visit_start_date: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  cancel: { type: Boolean, default: false },
  patient_color: { type: String, default: '#000' },
});

const Visit = mongoose.models.visits || mongoose.model("visits", visitSchema);
export default Visit;
