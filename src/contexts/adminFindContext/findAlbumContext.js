import React, { createContext, useState } from "react";

export const AlbumContext = createContext();

export const AlbumProvider = ({ children }) => {
  const [albumTitle, setAlbumTitle] = useState("");
  return (
    <AlbumContext.Provider value={{ albumTitle, setAlbumTitle }}>
      {children}
    </AlbumContext.Provider>
  );
};
