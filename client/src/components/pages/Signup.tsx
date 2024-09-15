import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import UserAuthForm from '../UserAuthForm';
import {useToast} from '@/hooks/use-toast';

interface FormDataType {
    email: string;
    password: string;
}


const Signup = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();
    const navigate = useNavigate();

    async function handleSubmit({email, password}: FormDataType) {
        setIsLoading(true);

        const payload = {email, password};

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
                'https://cinebase.erkindilekci.me/signup',
                requestOptions
            );
            if (response.status === 201) {
                toast({title: 'Success', description: "You have successfully created your account. Now you can login with your email and password."});
                navigate('/login');
            } else {
                const data = await response.json();
                if ('error_message' in data) {
                    toast({title: 'Error', description: data.error_message});
                }
            }
        } catch (error) {
            toast({title: 'Error', description: String(error)});
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email and password below to create your
                        account
                    </p>
                </div>
                <UserAuthForm
                    buttonLabel="Sign Up"
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                />
                <p className="text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{' '}
                    <span className="cursor-pointer underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="cursor-pointer underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                    </span>
                    .
                </p>
                <p className="text-center text-sm text-muted-foreground">
                    Already have an acoount?{' '}
                    <Link
                        to="/login"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Login to your account
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
};

export default Signup;
