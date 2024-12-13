import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import { ThemeProvider } from "./contexts/darkMode/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchProvider } from "./contexts/SearchContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <SearchProvider>
          <ThemeProvider>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </ThemeProvider>
        </SearchProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
