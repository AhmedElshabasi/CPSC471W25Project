import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersPage from "./components/ui/UsersPage/UsersPage";
import SignUpPage from "./components/ui/SignUpPage/SignUpPage";
import { useState } from 'react'
import './App.css'
import Header from "/src/components/ui/header"

function App() {

  return (
    <>
    <div className="dark bg-background text-foreground min-h-screen">
      <Router>
      <Header></Header>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/users" element={<UsersPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
        </Routes>
      </Router>
    </div>
    </>
    
  )
}
export default App