import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [memberId, setMemberId] = useState(null);

    return (
        <AuthContext.Provider value={{ memberId, setMemberId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);