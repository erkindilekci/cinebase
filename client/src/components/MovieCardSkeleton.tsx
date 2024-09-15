import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {ArrowLeft, CalendarIcon, ClockIcon} from 'lucide-react';
import {Button} from './ui/button';

const MovieCardSkeleton = () => {
    return (
        <Card className="w-full max-w-3xl overflow-hidden mx-auto shadow-lg">
            <div className="flex flex-col sm:flex-row">
                <CardHeader className="p-0 sm:w-1/3">
                    <div className="relative h-64 sm:h-full w-full">
                        <Skeleton className="absolute inset-0"/>
                    </div>
                </CardHeader>
                <div className="flex flex-col justify-between sm:w-2/3">
                    <CardContent className="p-6">
                        <Skeleton className="h-8 w-3/4 mb-4"/>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2"/>
                                <Skeleton className="h-4 w-12"/>
                            </div>
                            <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-2"/>
                                <Skeleton className="h-4 w-12"/>
                            </div>
                        </div>
                        <Skeleton className="h-6 w-24 mb-4"/>
                        <Skeleton className="h-4 w-full mb-2"/>
                        <Skeleton className="h-4 w-full mb-2"/>
                        <Skeleton className="h-4 w-3/4 mb-4"/>
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-16"/>
                            <Skeleton className="h-6 w-16"/>
                            <Skeleton className="h-6 w-16"/>
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                        <Button className="w-full" disabled>
                            <ArrowLeft className="mr-2 h-4 w-4"/> Back
                        </Button>
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
};

export default MovieCardSkeleton;
