import { createContext, useState } from "react";


export const  StudentContext = createContext(null)

export default function StudentProvider({ children }) {
    const [studentCourses, setStudentCourses] = useState([])
    const [loading, setLoading] = useState(true)

    return (
        <StudentContext.Provider value={{
            studentCourses, 
            setStudentCourses,
            loading, 
            setLoading
        }}>
            { children }
        </StudentContext.Provider>
    )
}