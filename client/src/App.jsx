import { Route, Routes } from "react-router-dom"
import AuthPage from "./pages/auth"
import RouteGuard from "./components/route-guard"
import { useContext } from "react"
import { AuthContext } from "./context/auth"
import InstructorDashboard from "./pages/instructor"
import StudentView from "./components/student-view/common-layout"
import StudentHomePage from "./pages/student/home"


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
              element={<InstructorDashboard />}
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
        </Route>
    </Routes>
  )
}

export default App
