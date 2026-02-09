import { 
    createContext, 
    useContext, 
    useState, 
    type ReactNode 
} from "react";

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