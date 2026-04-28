import { 
    createContext, 
    useContext, 
    useEffect, 
    useState, 
    type ReactNode 
} from "react";
import { api } from "../api";
import { type IAccount } from "../entities";

interface IAccountContext {
    account: IAccount | null;
    isLoading: boolean;
    setAccount: (account: IAccount | null) => void;
}

export const AccountContext = createContext<IAccountContext | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<IAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get("/auth/me")
            .then((response) => {
                setAccount(response.data);
            })
            .catch((error) => {
                console.log("No active session found.");
                setAccount(null); 
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <AccountContext.Provider value={{ account, isLoading, setAccount }}>
            {children}
        </AccountContext.Provider>
    );
}

export const useAccountContext = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error("useAccountContext must be used within an AccountProvider");
    }
    return context;
}

export const useProtectedAccount = () => {
    const context = useAccountContext();

    if (!context.account) {
        throw new Error("useProtectedAccount must only be used inside protected routes!");
    }

    return {
        account: context.account,
        setAccount: context.setAccount
    };
};