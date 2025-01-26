import { Outlet } from "react-router-dom"
import StudentHeader from "./header"


function StudentView() {
    return (
        <div>
            <StudentHeader />
            <Outlet />
        </div>
    )
}

export default StudentView