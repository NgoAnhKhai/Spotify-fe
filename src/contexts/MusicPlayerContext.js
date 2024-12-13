import React, { createContext, useState } from "react";

export const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  return (
    <MusicPlayerContext.Provider
      value={{ currentSong, setCurrentSong, playlist, setPlaylist }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
