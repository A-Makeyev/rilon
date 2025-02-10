import { Outlet, useLocation } from "react-router-dom"
import StudentHeader from "./header"


function StudentView() {
    const location = useLocation()

    return (
        <div>
            { !location.pathname.includes('/course-progress') ? <StudentHeader /> : null}
            <Outlet />
        </div>
    )
}

export default StudentView