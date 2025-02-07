import { createContext, useState } from "react";


export const  StudentContext = createContext(null)

export default function StudentProvider({ children }) {
    const [studentCourses, setStudentCourses] = useState([])
    const [studentCourseDetails, setStudentCourseDetails] = useState(null)
    const [currentCourseId, setCurrentCourseId] = useState(null)
    const [loading, setLoading] = useState(true)

    return (
        <StudentContext.Provider value={{
            studentCourses, 
            setStudentCourses,
            studentCourseDetails, 
            setStudentCourseDetails,
            currentCourseId, 
            setCurrentCourseId,
            loading, 
            setLoading
        }}>
            { children }
        </StudentContext.Provider>
    )
}