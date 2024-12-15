import React, { createContext, useState } from "react";

export const ArtistContext = createContext();

export const ArtistProvider = ({ children }) => {
  const [artistName, setArtistName] = useState("");
  return (
    <ArtistContext.Provider value={{ artistName, setArtistName }}>
      {children}
    </ArtistContext.Provider>
  );
};
