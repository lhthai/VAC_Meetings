import React, { createContext, useState, useEffect } from "react";
import { UserAgentApplication } from "msal";
import { getUserDetails } from "../GraphService";
import config from "../Config";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  const msalClient = new UserAgentApplication({
    auth: {
      clientId: config.appId,
      redirectUri: "http://localhost:3000",
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true,
    },
  });

  const getUserProfile = async () => {
    try {
      let accessToken = await msalClient.acquireTokenSilent({
        scopes: config.scopes,
      });
      if (accessToken) {
        let user = await getUserDetails(accessToken);
        setAccessToken(accessToken);
        setIsAuthenticated(true);
        setLoggedUser({
          displayName: user.displayName,
          email: user.email || user.userPrincipalName,
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsAuthenticated(false);
      setLoggedUser({});
      setIsLoading(false);
    }
  };

  useEffect(async () => {
    await getUserProfile();
  }, []);

  const login = async () => {
    try {
      await msalClient.loginPopup({
        scopes: config.scopes,
        prompt: "select_account",
      });
      await getUserProfile();
    } catch (error) {
      setIsAuthenticated(false);
      setLoggedUser({});
      setIsLoading(false);
    }
  };

  const logout = () => {
    msalClient.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        loggedUser,
        setLoggedUser,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
