import React, { useContext } from "react";

const AuthenticationContext = React.createContext();

export const useAuthenticationContext = () => {
    return useContext(AuthenticationContext);
}

export const AuthenticationProvider = ({ children }) => {
    const checkRole = (id) => {
        let roleName = "";
        if (id == 0) {
            roleName = "user";
        } else {
            roleName = "admin";
        }
        return roleName;
    }

    return <AuthenticationContext.Provider value={{ checkRole }}>{children}</AuthenticationContext.Provider>
}