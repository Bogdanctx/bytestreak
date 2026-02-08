import { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    type ReactNode 
} from "react";
import { api } from "../api";

interface Account {
    username: string;
    email: string;
    profilePictureUrl?: string;
}

interface AccountContextType {
    account: Account | null;
    isLoading: boolean;
    refreshAccount: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<Account | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAccount = () => {
        setIsLoading(true);
        api.get("/auth/me")
            .then(response => {
                if (response.status === 200) {
                    setAccount(response.data);
                } 
                else {
                    setAccount(null);
                }
            })
            .catch(() => setAccount(null))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    return (
        <AccountContext.Provider value={{ account, isLoading, refreshAccount: fetchAccount }}>
            {children}
        </AccountContext.Provider>
    );
}

// Custom hook for easy access
export function useAccount() {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error("useAccount must be used within an AccountProvider");
    }
    return context;
}