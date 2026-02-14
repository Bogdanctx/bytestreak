import { 
    createContext, 
    useContext, 
    useEffect, 
    useState, 
    type ReactNode 
} from "react";
import { api } from "../api";
import { set } from "react-hook-form";
import { type IAccount } from "../entities";


interface AccountContextType {
    account: IAccount | null;
    isLoading: boolean;
    setAccount: (account: IAccount | null) => void;
}

export const AccountContext = createContext<AccountContextType | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<IAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!account) {
            setIsLoading(true);

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
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
        else {
            setIsLoading(false);
        }
    }, []);

    return (
        <AccountContext.Provider value={{ account, isLoading, setAccount }}>
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