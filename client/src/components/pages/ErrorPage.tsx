import {useRouteError} from 'react-router-dom';
import ErrorCard from '../ErrorCard';

const ErrorPage = () => {
    const error = useRouteError();

    let errorMessage: string;
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (
        typeof error === 'object' &&
        error !== null &&
        'statusText' in error
    ) {
        errorMessage = (error as { statusText: string }).statusText;
    } else {
        errorMessage = 'Sorry, an unexpected error has occurred.';
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <ErrorCard alertDescription={errorMessage}/>
        </div>
    );
};

export default ErrorPage;
