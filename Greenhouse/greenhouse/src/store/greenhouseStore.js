import React, { useContext, useState } from "react";

const GreenhouseDataContext = React.createContext();

export const useGreenhouseDataContext = () => {
    return useContext(GreenhouseDataContext);
}

export const GreenhouseDataProvider = ({ children }) => {
    const [greenhouseData, setGreenhouseData] = useState([]);

    return <GreenhouseDataContext.Provider value={{ greenhouseData, setGreenhouseData }}>{children}</GreenhouseDataContext.Provider>
}