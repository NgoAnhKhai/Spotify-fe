import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import { ThemeProvider } from "./contexts/darkMode/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchProvider } from "./contexts/SearchContext";
import { UserProvider } from "./contexts/adminFindContext/findUserContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <SearchProvider>
            <ThemeProvider>
              <AuthProvider>
                <Router />
              </AuthProvider>
            </ThemeProvider>
          </SearchProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
