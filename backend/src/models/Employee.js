const mongoose = require("mongoose")

const SHIFT_OPTIONS = ["Opening", "Midday", "Afternoon", "Closing"]
const WORKING_STATUSES = ["Working", "Terminated", "Seasonal"]

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    hoursPerWeek: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    hireDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
    },
    workingStatus: {
      type: String,
      enum: WORKING_STATUSES,
      default: "Working",
    },
    preferredShift: {
      type: String,
      enum: SHIFT_OPTIONS,
      default: "Opening",
    },
    availabilityNotes: {
      type: String,
      trim: true,
    },
    availability: [
      {
        day: {
          type: String,
          enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        },
        startTime: String,
        endTime: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

employeeSchema.pre("validate", function handleDerivedFields(next) {
  const first = this.firstName || ""
  const last = this.lastName || ""

  if (!this.name && (first || last)) {
    this.name = `${first} ${last}`.trim()
  }

  if (!this.startDate && this.hireDate) {
    this.startDate = this.hireDate
  }

  next()
})

module.exports = mongoose.model("Employee", employeeSchema)
