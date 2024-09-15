import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import UserAuthForm from '../UserAuthForm';

interface FormDataType {
    email: string;
    password: string;
}

export interface OutletContextType {
    jwtToken: string;
    setJwtToken: React.Dispatch<React.SetStateAction<string>>;
}

type FetchDataType = { error_message: string } | { token: string };

const Login = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setJwtToken } = useOutletContext<OutletContextType>();
    const { toast } = useToast();
    const navigate = useNavigate();

    async function handleSubmit({ email, password }: FormDataType) {
        setIsLoading(true);

        const payload = { email, password };

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        };

        try {
            const response = await fetch(
                '${process.env.BACKEND_URL}/login',
                requestOptions
            );
            const data: FetchDataType = await response.json();

            if ('error_message' in data) {
                toast({ title: 'Error', description: data.error_message });
            } else if ('token' in data) {
                setJwtToken(data.token);
                localStorage.setItem('token', data.token);
                navigate('/');
            }
        } catch (error) {
            toast({ title: 'Error', description: String(error) });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token !== null && token !== '') {
            setJwtToken(token);
            navigate('/');
        }
    }, [setJwtToken, navigate]);

    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Login to your account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email and password below to login to your
                        account
                    </p>
                </div>
                <UserAuthForm
                    buttonLabel="Login"
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                />
                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Create a new account
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
};

export default Login;
