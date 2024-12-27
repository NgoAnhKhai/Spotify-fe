import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AlbumIcon from "@mui/icons-material/Album";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import { useAuth } from "../../contexts/AuthContext";
import fetchGetAllUser from "../../services/adminServices.js/UsersAdminServices.js/fetchGetAllUser";
import AdminIconComponent from "../../components/adminIcon/AdminIconComponent";
import UserMenuComponent from "../../components/avatar/UserAvatarMenu";
import UsersManagement from "./UsersManagerment/UsersManagerment";
import SongsManagerment from "./Songs/SongsManagerment";
import AlbumsManagerment from "./albums/AlbumsManagerment";
import ArtistsManagerment from "./Artists/ArtistsManagerment";
import GenresManagerment from "./Genres/GenresManagerment";
import { fetchGetAllSong } from "../../services/songService";
import { fetchGetAllAlbums } from "../../services/adminServices.js/AlbumsAdminServices.js/fetchGetAllAlbums";
import { fetchGetAllArtist } from "../../services/adminServices.js/ArtistAdminServices.js/fetchGetAllArtist";
import { fetchGetAllGenres } from "../../services/adminServices.js/GenresAdminServices.js/fetchAllGenres";

const AdminPage = () => {
  const { user, signout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [showUsersManager, setShowUsersManager] = useState(false);
  const [showSongsManager, SetShowSongsManager] = useState(false);
  const [showAlbumsManager, SetShowAlbumsManager] = useState(false);
  const [showArtistsManager, SetShowArtistsManager] = useState(false);
  const [showGenresManager, SetShowGenresManager] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSongs, setTotalSongs] = useState(0);
  const [totalAlbums, setTotalAlbums] = useState(0);
  const [totalArtits, setTotalArtits] = useState(0);
  const [totalGenres, setTotalGenres] = useState(0);
  const handleCardClick = (tabIndex) => {
    setActiveTab(tabIndex);
    setShowUsersManager(tabIndex === 3);
    SetShowSongsManager(tabIndex === 0);
    SetShowAlbumsManager(tabIndex === 1);
    SetShowArtistsManager(tabIndex === 2);
    SetShowGenresManager(tabIndex === 4);
  };

  const handleLogout = () => {
    signout();
  };

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        // Fetch total users
        const userData = await fetchGetAllUser(1, 1);
        setTotalUsers(userData?.pagination?.totalUsers || 0);

        // Fetch total songs
        const songData = await fetchGetAllSong(1, 1);
        setTotalSongs(songData?.pagination?.totalSong || 0);

        // Fetch total albums
        const albumData = await fetchGetAllAlbums(1, 1);
        setTotalAlbums(albumData?.pagination?.totalAlbums || 0);

        // Fetch total Artist
        const ArtistData = await fetchGetAllArtist(1, 1);
        setTotalArtits(ArtistData?.pagination?.totalArtists || 0);

        // Fetch total Genres
        const GenreData = await fetchGetAllGenres(1, 1);
        setTotalGenres(GenreData?.pagination?.totalGenres || 0);
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };

    fetchTotals();
  }, []);

  const menuItems = [
    {
      label: "Total Songs",
      icon: <MusicNoteIcon sx={{ color: "#1db954" }} />,
      value: totalSongs,
    },
    {
      label: "Total Albums",
      icon: <AlbumIcon sx={{ color: "#9b51e0" }} />,
      value: totalAlbums,
    },
    {
      label: "Total Artists",
      icon: <PeopleIcon sx={{ color: "#f2994a" }} />,
      value: totalArtits,
    },
    {
      label: "Total Users",
      icon: <PersonIcon sx={{ color: "#2d9cdb" }} />,
      value: totalUsers,
    },
    {
      label: "Total Genres",
      icon: <CategoryIcon sx={{ color: "#ff6347" }} />,
      value: totalGenres,
    },
  ];

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#121212",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Music Manager
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#888" }}>
            Manage your music catalog
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <AdminIconComponent user={user} />
          <UserMenuComponent user={user} onLogout={handleLogout} />
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ position: "relative", marginBottom: "40px" }}>
        <Grid container spacing={2}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Paper
                sx={{
                  padding: "20px",
                  backgroundColor: "#1e1e1e",
                  textAlign: "center",
                  borderRadius: "10px",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === index ? "4px solid" : "4px solid transparent",
                  borderColor:
                    activeTab === index
                      ? item.icon.props.sx.color
                      : "transparent",
                  "&:hover": { backgroundColor: "#2b2b2b" },
                }}
                onClick={() => handleCardClick(index)}
              >
                {item.icon}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: item.icon.props.sx.color }}
                >
                  {item.value}
                </Typography>
                <Typography variant="body1" sx={{ color: "#ccc" }}>
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Sliding Underline */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-6px",
            left: `${activeTab * 20}%`,
            width: "20%",
            height: "4px",
            backgroundColor: menuItems[activeTab].icon.props.sx.color,
            transition: "left 0.3s ease, background-color 0.3s ease",
          }}
        />
      </Box>

      {/* Display UsersManagerment if Total Users is clicked */}
      {showUsersManager && (
        <Box sx={{ marginTop: "40px" }}>
          <UsersManagement />
        </Box>
      )}
      {showSongsManager && (
        <Box sx={{ marginTop: "40px" }}>
          <SongsManagerment />
        </Box>
      )}
      {showAlbumsManager && (
        <Box sx={{ marginTop: "40px" }}>
          <AlbumsManagerment />
        </Box>
      )}
      {showArtistsManager && (
        <Box sx={{ marginTop: "40px" }}>
          <ArtistsManagerment />
        </Box>
      )}
      {showGenresManager && (
        <Box sx={{ marginTop: "40px" }}>
          <GenresManagerment />
        </Box>
      )}
    </Box>
  );
};

export default AdminPage;
