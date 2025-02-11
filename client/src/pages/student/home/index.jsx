import { useContext, useEffect } from "react"
import { StudentContext } from "@/context/student"
import { courseCategories } from "@/config"
import { getStudentCourses } from "@/services"
import { Button } from "@/components/ui/button"
import banner from "/src/assets/banner.jpg"


function StudentHomePage() {
    const { studentCourses, setStudentCourses } = useContext(StudentContext)

    async function getCourses() {
        const response = await getStudentCourses()

        if (response?.success) {
            setStudentCourses(response?.data)
        }
    }

    useEffect(() => {
        getCourses()
    }, [])

    return (
        <div className="min-h-screen bg-white">
            <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
                <div className="lg:w-1/2 lg:pr-12 my-10 container">
                    <h1 className="text-xl lg:text-3xl font-bold mb-4">
                        Software courses for high school and college students
                    </h1>
                    <p className="text-lg lg:xl">
                        Be fully confident to pass your next exams and get the career you always desired with our experienced teachers
                    </p>
                </div>
                <div className="lg:w-full mb-8 lg:mb-0">
                    <img src={banner} className="w-full h-auto rounded-md shadow-md" />
                </div>
            </section>
            <section className="py-8 px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">
                    Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {courseCategories.map(item => (
                        <Button key={item.id} variant="outline" className="justify-start">
                            { item.label }
                        </Button>
                    ))}
                </div>
            </section>
            <section className="py-12 px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">
                    Featured Courses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {studentCourses && studentCourses.length > 0 ? (
                        studentCourses.map(item => (
                            <div key={item.title} className="shadow border rounded overflow-hidden cursor-pointer">
                                <img src={item.image_url} className="w-full h-60 object-cover" />
                                <div className="p-4">
                                    <p className="text-lg font-semibold">
                                        { item.title }
                                    </p>
                                    <p className="text-base font-semibold text-gray-700">
                                        Created by {' '}
                                        <span className="cursor-pointer text-blue-700 hover:text-blue-500 transition">
                                            { item.instructorName }
                                        </span>
                                    </p>
                                    <p className="text-base font-semibold text-gray-700">
                                        {`${item.curriculum.length} ${item.curriculum.length <= 1 ? 'Lecture' : 'Lectures'}, ${item.level}`}
                                    </p>
                                    <p className="text-lg font-semibold">
                                        { item.price }$
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="items-center">
                            <h1>No courses found</h1>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default StudentHomePage