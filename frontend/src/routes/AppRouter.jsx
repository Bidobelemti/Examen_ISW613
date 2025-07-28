import React from "react";
import { useRoutes } from "react-router-dom";
import BooksPage from "../pages/BooksPage";
import BookDetailPage from "../pages/BookDetailPage"; 
import MyLoansPage from "../pages/MyLoansPage"; 
import LoginPage from "../pages/LoginPage"; 
import NotFound from "../pages/NotFound";


export default function AppRouter() {

  const routes = useRoutes([
    { path: "/", element: <BooksPage />},
    { path: "/libros", element: <BooksPage /> },
    { path: "/libros/:id", element: <BookDetailPage /> },
    { path: "/mis-prestamos", element: <MyLoansPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "*", element: <NotFound/> }
  ]);

  return routes;
}