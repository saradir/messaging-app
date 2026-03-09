import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import './App.css'

import Login from "./pages/Login";
import Register from './pages/Register';
import Homepage from "./pages/Homepage";
import { ProtectedRoute } from './components/ProtectedRoute';


function App() {

  const [currentUser, setCurrentUser] = useState(null);
  return(
    <>
    
      <AuthContext value={{currentUser, setCurrentUser}}>
        <Routes>

          
          <Route
            path="/login"
            element= {<Login />}
          />

          <Route
            path="/register"
            element= {<Register />}
          />

          <Route
            path="/"
            element= {
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>           
            }
          />
        </Routes>
      </AuthContext>
    </>
  )

}

export default App
