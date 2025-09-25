import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

const ContextApi = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for initial value
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <GlobalContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextApi;
