import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import AuthProvider from "./context/auth/index.jsx"
import InstructorProdiver from "./context/instructor/index.jsx"
import StudentProvider from "./context/student/index.jsx"
import App from "./App.jsx"
import "./index.css"


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <InstructorProdiver>
        <StudentProvider>
          <App />
        </StudentProvider>
      </InstructorProdiver>
    </AuthProvider>
  </BrowserRouter>
)
