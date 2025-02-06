const mongoose = require("mongoose")


const LectureSchema = new mongoose.Schema({
  title: String,
  video_url: String,
  public_id: String,
  preview: Boolean
})

const CourseSchema = new mongoose.Schema({
  instructorId: String,
  instructorName: String,
  date: Date,
  title: String,
  category: String,
  level: String,
  language: String,
  subtitle: String,
  description: String,
  image_url: String,
  public_id: 'String',
  welcomeMessage: String,
  price: Number,
  objectives: String,
  isPublished: Boolean,
  curriculum: [LectureSchema],
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
      paidAmount: String
    }
  ]
})

module.exports = mongoose.model('Course', CourseSchema)