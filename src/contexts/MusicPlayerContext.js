import React, { createContext, useEffect, useState } from "react";

export const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    if (
      Array.isArray(playlist) &&
      playlist.length > 0 &&
      !playlist.some((song) => song._id === currentSong?._id)
    ) {
    }
  }, [playlist, currentSong]);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        playlist,
        setPlaylist,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
