import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import { ThemeProvider } from "./contexts/darkMode/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchProvider } from "./contexts/SearchContext";
import { NameProvider } from "./contexts/adminFindContext/findUserContext";
import { ArtistProvider } from "./contexts/adminFindContext/findArtistContext";
import { GenreProvider } from "./contexts/adminFindContext/findGenreContext";
import { SongProvider } from "./contexts/adminFindContext/findSongContext";
import { AlbumProvider } from "./contexts/adminFindContext/findAlbumContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <ArtistProvider>
          <NameProvider>
            <AlbumProvider>
              <SongProvider>
                <GenreProvider>
                  <SearchProvider>
                    <ThemeProvider>
                      <AuthProvider>
                        <Router />
                      </AuthProvider>
                    </ThemeProvider>
                  </SearchProvider>
                </GenreProvider>
              </SongProvider>
            </AlbumProvider>
          </NameProvider>
        </ArtistProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
