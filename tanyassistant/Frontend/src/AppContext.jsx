import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export function BaseUrlProvider({ children }) {
    const [baseUrl, setBaseUrl] = useState('');

    return (
        <AppContext.Provider value={{ baseUrl, setBaseUrl }}>
            {children}
        </AppContext.Provider>
    );
}
