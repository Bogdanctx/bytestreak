export type RegisterFormInputs = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type RegisterFormProps = {
    setShowAuthState: React.Dispatch<React.SetStateAction<'login' | 'register' | null>>;
};
