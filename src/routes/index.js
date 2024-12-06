import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/HomePage";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

function Router() {
  let location = useLocation();
  let state = location.state;

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      )}
    </>
  );
}

export default Router;
