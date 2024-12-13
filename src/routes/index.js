import * as React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/HomePage";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AlbumPage from "../pages/AlbumPage";
import ProtectedRoute from "../contexts/ProtectedRoute";
import ProfilePage from "../pages/ProfilePage";
import PlaylistPage from "../pages/PlaylistPage";
import DashboardPage from "../pages/admin/DashboardPage";
import ProtectedAdminRoute from "../contexts/adminProtected/ProtectedAdminRoute";
import ArtistPage from "../pages/ArtistPage";

import AllSongsPage from "../pages/AllSongsPage";

function Router() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <DashboardPage />
            </ProtectedAdminRoute>
          }
        ></Route>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/songs" element={<AllSongsPage />} />
          <Route path="/me/playlist/:id" element={<PlaylistPage />} />
          <Route path="users/me/profile" element={<ProfilePage />} />
          <Route path="/artists/:id" element={<ArtistPage />} />
          <Route
            path="/album/:id"
            element={
              <ProtectedRoute>
                <AlbumPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default Router;
