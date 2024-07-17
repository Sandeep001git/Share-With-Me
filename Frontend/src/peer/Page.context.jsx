import { useState, useContext, createContext } from "react";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

// eslint-disable-next-line react/prop-types
export const AppProvider = ({ children }) => {
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const resetApp = () => {
        setIsFirstLoad(false);
    };
    return (
        <AppContext.Provider value={{isFirstLoad,resetApp}}>
            {children}
        </AppContext.Provider>
    )
};
