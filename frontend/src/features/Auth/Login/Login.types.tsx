export type LoginFormInputs = {
    email: string;
    password: string;
};

export type LoginFormProps = {
    setShowAuthState: React.Dispatch<React.SetStateAction<'login' | 'register' | null>>;
};