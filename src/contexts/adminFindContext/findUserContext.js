import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);

  const updateSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <UserContext.Provider value={{ searchResults, updateSearchResults }}>
      {children}
    </UserContext.Provider>
  );
};
