import { useContext } from "react"
import { AuthContext } from "./context/auth"
import { Route, Routes } from "react-router-dom"
import AuthPage from "./pages/auth"
import RouteGuard from "./components/route-guard"
import InstructorView from "./pages/instructor"
import StudentView from "./components/student-view/common-layout"
import StudentHomePage from "./pages/student/home"
import NotFound from "./pages/not-found"
import CreateNewCourse from "./pages/instructor/crerate-new-course"
import StudentCoursesPage from "./pages/student/courses"
import StudentCoursesDetailsPage from "./pages/student/course-details"


const App = () => {
  const { auth } = useContext(AuthContext)

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            isAuthenticated={auth?.isAuthenticated}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorView />}
            isAuthenticated={auth?.isAuthenticated}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<CreateNewCourse />}
            isAuthenticated={auth?.isAuthenticated}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<CreateNewCourse />}
            isAuthenticated={auth?.isAuthenticated}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/" 
        element={
          <RouteGuard
            element={<StudentView />}
            isAuthenticated={auth?.isAuthenticated}
            user={auth?.user}
          />
        }
      >
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="courses" element={<StudentCoursesPage />} />
        <Route path="course/details/:id" element={<StudentCoursesDetailsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
