const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema(
  {
    user_id: [{type: mongoose.Types.ObjectId, ref: "User", required: true}],
    payroll_id: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Trimming whitespace
    },
    name_kh: {
      type: String,
      required: true,
    },
    name_en: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    date_of_starting_work: {
      type: Date,
      required: true,
    },
    location_kh: {
      type: String,
      required: true,
    },
    location_type: {
      type: String,
      enum: ["Urban", "Rural"],
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    commune: {
      type: String,
      required: true,
    },
    current_position: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    salary_level_kh: {
      type: String,
      required: true,
    },
    salary_degree: {
      type: String,
      required: true,
    },
    salary_type_shift_date: {
      type: String,
      required: true,
    },
    highest_qualification: {
      type: String,
      required: true,
    },
    highest_qualification_subject: {
      type: String,
      required: true,
    },
    highest_qualification_date: {
      type: Date,
      required: true,
    },
    highest_professional: {
      type: String,
      required: true,
    },
    professional: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

  const UserDetail = mongoose.model('UserDetail', userDetailSchema)
  
  module.exports = UserDetail

