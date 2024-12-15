import { Fragment } from "react"
import { useLocation, Navigate } from "react-router-dom"


function RouteGuard({ isAuthenticated, user, element }) {
    const location = useLocation()

    if (!isAuthenticated && !location.pathname.includes('/auth')) {
        return <Navigate to="/auth" />
    }

    if (
        isAuthenticated && user?.role !== 'instructor' &&
        (location.pathname.includes('instructor') || location.pathname.includes('/auth'))
    ) {
        return <Navigate to="/home" />      
    }   

    if (isAuthenticated && user?.role === 'instructor' && !location.pathname.includes('instructor')) {
        return <Navigate to="/instructor" /> 
    }

    return <Fragment>{ element }</Fragment>
}

export default RouteGuard
