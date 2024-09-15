import {ExclamationTriangleIcon} from '@radix-ui/react-icons';
import {Alert, AlertDescription, AlertTitle} from './ui/alert';

interface ErrorPropTypes {
    alertTitle?: string;
    alertDescription: string;
}

const ErrorCard = ({alertTitle, alertDescription}: ErrorPropTypes) => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <Alert
                className="mx-64 flex flex-col items-center justify-center text-center"
                variant="destructive"
            >
                <ExclamationTriangleIcon className="h-4 w-4 mr-4"/>
                <div>
                    {alertTitle !== undefined ? (
                        <AlertTitle>{alertTitle}</AlertTitle>
                    ) : (
                        <AlertTitle>Error</AlertTitle>
                    )}
                    <AlertDescription>{alertDescription}</AlertDescription>
                </div>
            </Alert>
        </div>
    );
};

export default ErrorCard;
