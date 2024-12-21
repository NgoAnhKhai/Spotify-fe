import React, { createContext, useState, useContext } from "react";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext";

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const { setPlaylist } = useContext(MusicPlayerContext);

  const updateSearchResults = (results) => {
    setSearchResults(results);
    setPlaylist(results);
  };

  return (
    <SearchContext.Provider value={{ searchResults, updateSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
};
