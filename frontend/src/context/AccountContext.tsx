import { 
    createContext, 
    useContext, 
    useEffect, 
    useState, 
    type ReactNode 
} from "react";
import { api } from "../api";

export interface Account {
    username: string;
    email: string;
    level: number;
    currentXP: number;
    problemsSolved: number;
    quizzesSolved: number;
    streakLength: number;
    friendsCount: number;
    profilePictureUrl: string;
}

interface AccountContextType {
    account: Account | null;
    setAccount: (account: Account | null) => void;
}

export const AccountContext = createContext<AccountContextType | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<Account | null>(null);

    useEffect(() => {
        if (!account) {
            api.get("/auth/me")
                .then((response) => {
                    if(response.status === 200) {
                        setAccount(response.data);
                    }
                    else {
                        window.location.href = "/";
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch account data:", error);
                });
        }
    }, []);

    return (
        <AccountContext.Provider value={{ account, setAccount }}>
            {children}
        </AccountContext.Provider>
    );
}

export function useAccountContext() {
    const context = useContext(AccountContext);

    if (!context) {
        throw new Error("useAccountContext must be used within an AccountProvider");
    }

    return context;
}