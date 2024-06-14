import mongoose from "mongoose";

const patient = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  birth_year: { type: Date },
  address: { type: String },
  reason_for_visit: { type: String, required: true },
  start_of_issue: { type: String, required: true },
  level_of_pain: { type: Number },
  pain_radiate: { type: Boolean },
  pain_radiate_desc: { type: String },
  injuries: { type: Boolean },
  injuries_desc: { type: String },
  underlying_health_condition: { type: Boolean },
  underlying_health_condition_desc: { type: String },
  fee: { type: Number, required: true },
  repeat_visit_toggle: { type: Boolean },
  repeat_interval: { type: String },
  visit_timing: { type: String },
  visit_start_date: { type: Date },
  visit_end_date: { type: Date },
  color: { type: String, required: true },
  active_visit: { type: Boolean, default: true },
});

const Form = mongoose.models.patient || mongoose.model("patient", patient);
export default Form;
