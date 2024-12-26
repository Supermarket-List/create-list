// UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: string;
    nome: string;
}

interface UserContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextProps>({
    user: null,
    setUser: () => { },
    logout: () => { },
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const userNome = localStorage.getItem("userNome");

        if (userId && userNome) {
            setUser({ id: userId, nome: userNome });
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userNome");
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};
