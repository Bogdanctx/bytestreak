export interface RegisterFormInputs {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export interface RegisterFormProps {
    setShowAuthState: React.Dispatch<React.SetStateAction<'login' | 'register' | null>>;
};
