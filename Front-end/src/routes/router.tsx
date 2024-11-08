import { createBrowserRouter } from "react-router-dom";
import Homepage from "../components/Homepage";
import MovieDetailpage from "../components/MovieDetail";
import MovieDetailPage from "../components/MovieDetail";
import React from "react";
import App from "/src/App.jsx";
import SearchPage from "../components/SearchPage";
import LoginPage from "../components/LoginPage";
import SignUp from "../components/SignUp";
import Profile from "../components/Profile";
import RentMovie from "../components/RentMovie";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  { path: "/:title/:id", element: <MovieDetailPage /> },
  { path: "/search/:term", element: <SearchPage /> },
  { path: "/Login", element: <LoginPage /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/profile", element: <Profile /> },
  { path: "/rental/:id", element: <RentMovie /> },
]);

export default router;
