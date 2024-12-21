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
import DashboardPage from "../pages/admin/Users/DashboardPage";
import ProtectedAdminRoute from "../contexts/adminProtected/ProtectedAdminRoute";
import ArtistPage from "../pages/ArtistPage";

import AllSongsPage from "../pages/AllSongsPage";
import DashboardArtistPage from "../pages/admin/Artists/DashboardArtistPage";
import DashboardGenresPage from "../pages/admin/Genres/DashboardGenresPage";
import DashboardSongsPage from "../pages/admin/Songs/DashboardSongsPage";
import DashboardAlbumsPage from "../pages/admin/albums/DashboardAlbumsPage";
import FavoritesPage from "../pages/FavoritesPage";

function Router() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard/users"
          element={
            <ProtectedAdminRoute>
              <DashboardPage />
            </ProtectedAdminRoute>
          }
        ></Route>
        <Route
          path="/admin/dashboard/artists"
          element={
            <ProtectedAdminRoute>
              <DashboardArtistPage />
            </ProtectedAdminRoute>
          }
        ></Route>
        <Route
          path="/admin/dashboard/genres"
          element={
            <ProtectedAdminRoute>
              <DashboardGenresPage />
            </ProtectedAdminRoute>
          }
        ></Route>
        <Route
          path="/admin/dashboard/songs"
          element={
            <ProtectedAdminRoute>
              <DashboardSongsPage />
            </ProtectedAdminRoute>
          }
        ></Route>
        <Route
          path="/admin/dashboard/albums"
          element={
            <ProtectedAdminRoute>
              <DashboardAlbumsPage />
            </ProtectedAdminRoute>
          }
        ></Route>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/songs" element={<AllSongsPage />} />
          <Route path="/me/playlist/:id" element={<PlaylistPage />} />
          <Route path="/artists/:id" element={<ArtistPage />} />
          <Route
            path="/me/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/album/:id"
            element={
              <ProtectedRoute>
                <AlbumPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/:id/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default Router;
