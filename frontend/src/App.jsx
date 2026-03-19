import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import './App.css'

import Login from "./pages/Login";
import Register from './pages/Register';
import Homepage from "./pages/Homepage";
import { ProtectedRoute } from './components/ProtectedRoute';


function App() {


  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function authUser(){
      try {
        const response = await fetch(`${import.meta.env.VITE_API_SERVER}/auth/me`, {
          credentials: "include",
          cache: "no-store",
        });
  
        if(response.ok){
          const data = await response.json();
          setCurrentUser(data);
        }
      } catch (err) {
        console.error("Error contacting /auth/identify: ", err);
        setError("Server unreachable. Please try again later.");          
      } finally{
        setLoading(false);
      }
    }     
  authUser();
  }, []);


  if(loading) return <p>Loading</p>;
  if(error) return <p>{error}</p>;
  return(
    <>


      <AuthContext value={{currentUser, setCurrentUser}}>
        <Routes>

          
          <Route
            path="/login"
            element= {
            
            <Login />}
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
