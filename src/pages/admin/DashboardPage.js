import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, IconButton } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AlbumIcon from "@mui/icons-material/Album";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from "@mui/icons-material/Home";
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
import { Link } from "react-router-dom";
import AdminSkeletonLoader from "../../components/skeleton/AdminSkeletonLoader";

const AdminPage = () => {
  const { user, signout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [showUsersManager, setShowUsersManager] = useState(false);
  const [showSongsManager, setShowSongsManager] = useState(false);
  const [showAlbumsManager, setShowAlbumsManager] = useState(false);
  const [showArtistsManager, setShowArtistsManager] = useState(false);
  const [showGenresManager, setShowGenresManager] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSongs, setTotalSongs] = useState(0);
  const [totalAlbums, setTotalAlbums] = useState(0);
  const [totalArtits, setTotalArtits] = useState(0);
  const [totalGenres, setTotalGenres] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleCardClick = (tabIndex) => {
    setActiveTab(tabIndex);
    setShowUsersManager(tabIndex === 3);
    setShowSongsManager(tabIndex === 0);
    setShowAlbumsManager(tabIndex === 1);
    setShowArtistsManager(tabIndex === 2);
    setShowGenresManager(tabIndex === 4);
  };

  const handleLogout = () => {
    signout();
  };

  useEffect(() => {
    const fetchTotals = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        // Fetch total users
        const userData = await fetchGetAllUser(1, 1);
        console.log("User Data:", userData);
        setTotalUsers(userData?.pagination?.totalUsers || 0);

        // Fetch total songs
        const songData = await fetchGetAllSong(1, 1);
        console.log("Song Data:", songData);
        setTotalSongs(songData?.pagination?.totalSong || 0);

        // Fetch total albums
        const albumData = await fetchGetAllAlbums(1, 1);
        console.log("Album Data:", albumData);
        setTotalAlbums(albumData?.pagination?.totalAlbums || 0);

        // Fetch total Artist
        const artistData = await fetchGetAllArtist(1, 1);
        console.log("Artist Data:", artistData);
        setTotalArtits(artistData?.pagination?.totalArtists || 0);

        // Fetch total Genres
        const genreData = await fetchGetAllGenres(1, 1);
        console.log("Genre Data:", genreData);
        setTotalGenres(genreData?.pagination?.totalGenres || 0);
      } catch (error) {
        console.error("Error fetching totals:", error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return <AdminSkeletonLoader />;
  }

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
          <IconButton
            component={Link}
            to="/"
            sx={{ color: "#fff" }}
            aria-label="Home"
          >
            <HomeIcon />
          </IconButton>

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

      {/* Display Management Components Based on Active Tab */}
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
