const mongoose = require("mongoose")


const StudentCoursesSchema = new mongoose.Schema({
  userId: String,
  courses: [
    {
      courseId: String,
      title: String,
      instructorId: String,
      instructorName: String,
      purchaseDate: Date,
      courseImage: String,
      courseCategory: String
    },
  ]
})

module.exports = mongoose.model('StudentCourses', StudentCoursesSchema)