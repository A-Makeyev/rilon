module.exports = [
    {
      instructorId: "a1b2c3d4e5",
      instructorName: "John Doe",
      date: new Date("2024-01-15T10:00:00Z"),
      title: "JavaScript for Beginners",
      category: "Programming",
      level: "Beginner",
      language: "English",
      subtitle: "Learn JavaScript from Scratch",
      description: "This course will introduce you to the fundamentals of JavaScript.",
      image_url: "https://example.com/image1.jpg",
      public_id: "x1y2z3a4b5",
      welcomeMessage: "Welcome to the course!",
      price: 49.99,
      objectives: "Understand JavaScript basics, variables, and functions.",
      isPublished: true,
      curriculum: [
        { title: "Introduction", video_url: "https://example.com/video1.mp4", public_id: "2149v23sdv", preview: true },
        { title: "Variables and Data Types", video_url: "https://example.com/video2.mp4", public_id: "b23n58cx1v", preview: false }
      ],
      students: [
        { studentId: "stu001", studentName: "Alice Smith", studentEmail: "alice@example.com", paidAmount: "49.99" }
      ]
    },
    {
      instructorId: "f6g7h8i9j0",
      instructorName: "Jane Doe",
      date: new Date("2024-02-01T12:00:00Z"),
      title: "Advanced Python",
      category: "Programming",
      level: "Advanced",
      language: "English",
      subtitle: "Master Python with real-world projects",
      description: "A deep dive into Python with advanced concepts and projects.",
      image_url: "https://example.com/image2.jpg",
      public_id: "m3n4o5p6q7",
      welcomeMessage: "Get ready to become a Python expert!",
      price: 79.99,
      objectives: "Learn advanced Python concepts, OOP, and frameworks.",
      isPublished: true,
      curriculum: [
        { title: "OOP in Python", video_url: "https://example.com/video3.mp4", public_id: "x5y8z7w2v4", preview: false },
        { title: "Data Science with Python", video_url: "https://example.com/video4.mp4", public_id: "r9s3t4u1v0", preview: true }
      ],
      students: [
        { studentId: "stu002", studentName: "Bob Johnson", studentEmail: "bob@example.com", paidAmount: "79.99" }
      ]
    },
    {
      instructorId: "k1l2m3n4o5",
      instructorName: "Michael Scott",
      date: new Date("2024-03-10T15:00:00Z"),
      title: "Digital Marketing 101",
      category: "Marketing",
      level: "Intermediate",
      language: "English",
      subtitle: "Boost your business with digital marketing",
      description: "Learn the fundamentals of digital marketing and grow your business online.",
      image_url: "https://example.com/image3.jpg",
      public_id: "v6w7x8y9z0",
      welcomeMessage: "Let's dive into digital marketing!",
      price: 59.99,
      objectives: "Understand SEO, social media marketing, and PPC campaigns.",
      isPublished: false,
      curriculum: [
        { title: "SEO Basics", video_url: "https://example.com/video5.mp4", public_id: "q2w4e6r8t9", preview: true },
        { title: "Social Media Marketing", video_url: "https://example.com/video6.mp4", public_id: "y1u3i5o7p9", preview: false }
      ],
      students: []
    }
  ]  