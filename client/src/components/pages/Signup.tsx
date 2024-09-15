import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserAuthForm from '../UserAuthForm';

const Signup = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleSubmit(data: { email: string; password: string }) {
        setIsLoading(true);

        console.log('Email:', data.email);
        console.log('Password:', data.password);

        setIsLoading(false);
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
