import React, { createContext, useState } from "react";

export const GenreContext = createContext();

export const GenreProvider = ({ children }) => {
  const [genreName, setGenreName] = useState("");

  return (
    <GenreContext.Provider value={{ genreName, setGenreName }}>
      {children}
    </GenreContext.Provider>
  );
};
