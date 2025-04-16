import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersPage from "./components/ui/UsersPage/UsersPage";
import SignUpPage from "./components/ui/SignUpPage/SignUpPage";
import LoginPage from "./components/ui/LoginPage/LoginPage";
import Home from "./components/ui/HomePage/HomePage";
import AdminPage from "./components/ui/AdminPage/AdminPage";
import TicketPage from "./components/TicketPage";
import { useState } from 'react'
import './App.css'
import Header from "/src/components/ui/header"

function App() {
  return (
    <>
    <div className="dark bg-black text-foreground min-h-screen">
      <Router>
      <Header></Header>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/movie/:id" element={<TicketPage />} />
        </Routes>
      </Router>
    </div>

    </>
  );
}
export default App;
