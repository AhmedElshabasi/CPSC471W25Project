import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersPage from "./components/ui/UsersPage/UsersPage";
import SignUpPage from "./components/ui/SignUpPage/SignUpPage";
import LoginPage from "./components/ui/LoginPage/LoginPage";
import Home from "./components/ui/HomePage/HomePage";
import AdminPage from "./components/ui/AdminPage/AdminPage";
import TicketPage from "./components/TicketPage";
import { useState } from "react";
import "./App.css";
import Header from "/src/components/ui/header";
import NoResultsPage from "./components/ui/NoResultsPage";
import MovieSearchPage from "./components/ui/MovieSearchPage";
import AdminRoute from "./components/ui/AdminPage/AdminRoute";
import AdminHomePage from "./components/ui/AdminPage/AdminHomePage"
import NotAuthorizedAdmin from './components/ui/AdminPage/NotAuthorizedAdmin'

function App() {
  return (
    <>
      <div className="dark bg-black text-foreground min-h-screen">
        <Router>
          <Header></Header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/signUp" element={<SignUpPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/no-results" element={<NoResultsPage />} />
            <Route path="/admin/home/:id" element={<AdminRoute>
              <AdminHomePage></AdminHomePage>
            </AdminRoute>} />
            <Route path="/movie-search/:id" element={<MovieSearchPage />} />
            <Route path="/movie/:id" element={<TicketPage />} />
            <Route path="/admin/not-authorized" element={<NotAuthorizedAdmin/>} />
        </Routes>
        </Router>
      </div>
    </>
  );
}
export default App;
