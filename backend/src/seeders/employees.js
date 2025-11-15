const Employee = require("../models/Employee")

const demoEmployees = [
  {
    firstName: "Mari",
    lastName: "Lisa",
    name: "Mari Lisa",
    role: "Store Manager",
    hoursPerWeek: 40,
    hourlyRate: 18.0,
    email: "mari.lisa@example.com",
    phone: "(555) 123-4567",
    dateOfBirth: new Date("1990-03-01"),
    hireDate: new Date("2018-05-01"),
    startDate: new Date("2018-05-01"),
    workingStatus: "Working",
    preferredShift: "Opening",
    availabilityNotes: "Weekday mornings",
    availability: [
      { day: "monday", startTime: "09:00", endTime: "17:00" },
      { day: "tuesday", startTime: "09:00", endTime: "17:00" },
      { day: "wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "thursday", startTime: "09:00", endTime: "17:00" },
      { day: "friday", startTime: "09:00", endTime: "17:00" },
    ],
    isActive: true,
  },
  {
    firstName: "Vidhi",
    lastName: "Patel",
    name: "Vidhi Patel",
    role: "Shift Lead",
    hoursPerWeek: 35,
    hourlyRate: 15.5,
    email: "vidhi@howdy.com",
    phone: "(555) 234-5678",
    dateOfBirth: new Date("1996-02-10"),
    hireDate: new Date("2019-06-01"),
    startDate: new Date("2019-06-01"),
    workingStatus: "Working",
    preferredShift: "Midday",
    availabilityNotes: "Prefers mid-day leadership shifts",
    availability: [
      { day: "monday", startTime: "10:00", endTime: "18:00" },
      { day: "tuesday", startTime: "10:00", endTime: "18:00" },
      { day: "wednesday", startTime: "10:00", endTime: "18:00" },
      { day: "thursday", startTime: "10:00", endTime: "18:00" },
      { day: "friday", startTime: "10:00", endTime: "18:00" },
      { day: "saturday", startTime: "10:00", endTime: "18:00" },
    ],
    isActive: true,
  },
  {
    firstName: "Chatcha",
    lastName: "Mantapaneewat",
    name: "Chatcha Mantapaneewat",
    role: "Scooper",
    hoursPerWeek: 25,
    hourlyRate: 12.0,
    email: "chatcha@howdy.com",
    phone: "(555) 345-6789",
    dateOfBirth: new Date("1998-11-15"),
    hireDate: new Date("2020-08-20"),
    startDate: new Date("2020-08-20"),
    workingStatus: "Working",
    preferredShift: "Afternoon",
    availabilityNotes: "Available for late afternoon rush",
    availability: [
      { day: "friday", startTime: "14:00", endTime: "22:00" },
      { day: "saturday", startTime: "14:00", endTime: "22:00" },
      { day: "sunday", startTime: "14:00", endTime: "22:00" },
    ],
    isActive: true,
  },
  {
    firstName: "Alex",
    lastName: "Johnson",
    name: "Alex Johnson",
    role: "Scooper",
    hoursPerWeek: 20,
    hourlyRate: 12.0,
    email: "alex.johnson@example.com",
    phone: "(555) 456-7890",
    dateOfBirth: new Date("2000-09-05"),
    hireDate: new Date("2021-03-15"),
    startDate: new Date("2021-03-15"),
    workingStatus: "Working",
    preferredShift: "Closing",
    availabilityNotes: "Weekend closer",
    availability: [
      { day: "saturday", startTime: "12:00", endTime: "20:00" },
      { day: "sunday", startTime: "12:00", endTime: "20:00" },
    ],
    isActive: true,
  },
  {
    firstName: "Sarah",
    lastName: "Chen",
    name: "Sarah Chen",
    role: "Cashier",
    hoursPerWeek: 30,
    hourlyRate: 13.5,
    email: "sarah.chen@example.com",
    phone: "(555) 567-8901",
    dateOfBirth: new Date("1995-07-11"),
    hireDate: new Date("2017-09-10"),
    startDate: new Date("2017-09-10"),
    workingStatus: "Working",
    preferredShift: "Opening",
    availabilityNotes: "Morning opener",
    availability: [
      { day: "monday", startTime: "08:00", endTime: "16:00" },
      { day: "tuesday", startTime: "08:00", endTime: "16:00" },
      { day: "wednesday", startTime: "08:00", endTime: "16:00" },
      { day: "thursday", startTime: "08:00", endTime: "16:00" },
      { day: "friday", startTime: "08:00", endTime: "16:00" },
    ],
    isActive: true,
  },
  {
    firstName: "Mike",
    lastName: "Rodriguez",
    name: "Mike Rodriguez",
    role: "Scooper",
    hoursPerWeek: 28,
    hourlyRate: 12.0,
    email: "mike.rodriguez@example.com",
    phone: "(555) 678-9012",
    dateOfBirth: new Date("1999-12-21"),
    hireDate: new Date("2022-01-05"),
    startDate: new Date("2022-01-05"),
    workingStatus: "Working",
    preferredShift: "Midday",
    availabilityNotes: "Flexible mid shifts",
    availability: [
      { day: "tuesday", startTime: "11:00", endTime: "19:00" },
      { day: "wednesday", startTime: "11:00", endTime: "19:00" },
      { day: "thursday", startTime: "11:00", endTime: "19:00" },
      { day: "friday", startTime: "11:00", endTime: "19:00" },
      { day: "saturday", startTime: "11:00", endTime: "19:00" },
    ],
    isActive: true,
  },
  {
    firstName: "Emma",
    lastName: "Wilson",
    name: "Emma Wilson",
    role: "Cashier",
    hoursPerWeek: 22,
    hourlyRate: 13.5,
    email: "emma.wilson@example.com",
    phone: "(555) 789-0123",
    dateOfBirth: new Date("2001-04-08"),
    hireDate: new Date("2023-04-12"),
    startDate: new Date("2023-04-12"),
    workingStatus: "Working",
    preferredShift: "Afternoon",
    availabilityNotes: "Afternoon to evening support",
    availability: [
      { day: "monday", startTime: "13:00", endTime: "21:00" },
      { day: "wednesday", startTime: "13:00", endTime: "21:00" },
      { day: "friday", startTime: "13:00", endTime: "21:00" },
      { day: "saturday", startTime: "13:00", endTime: "21:00" },
    ],
    isActive: true,
  },
]

const seedEmployees = async () => {
  try {
    console.log("🌱 Seeding employees...")

    // Clear existing employees
    await Employee.deleteMany({})

    // Create employees
    for (const employeeData of demoEmployees) {
      const employee = new Employee(employeeData)
      await employee.save()
      console.log(`✅ Created employee: ${employeeData.name} (${employeeData.role})`)
    }

    console.log("🎉 Employees seeded successfully!")
    return await Employee.find()
  } catch (error) {
    console.error("❌ Error seeding employees:", error)
    return []
  }
}

module.exports = { seedEmployees }
