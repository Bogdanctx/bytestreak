import { AccountProvider } from "./AccountContext";

export function AppProviders(props: { children: React.ReactNode }) {
    return (
        <AccountProvider>
            {props.children}
        </AccountProvider>
    )
}