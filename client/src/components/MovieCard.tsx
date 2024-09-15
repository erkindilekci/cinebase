import {Badge} from './ui/badge';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {ArrowLeft, CalendarIcon, ClockIcon} from 'lucide-react';
import {Movie} from './pages/MovieDetails';
import {Button} from './ui/button';
import {useNavigate} from 'react-router-dom';

const MovieCard = ({movie}: { movie: Movie }) => {
    const navigate = useNavigate();

    return (
        <Card className="w-full max-w-3xl overflow-hidden mx-auto shadow-lg">
            <div className="flex flex-col sm:flex-row">
                {movie.image && (
                    <CardHeader className="p-0 sm:w-1/3">
                        <div className="relative h-64 sm:h-full w-full">
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="object-cover h-full w-full"
                            />
                        </div>
                    </CardHeader>
                )}
                <div className="flex flex-col justify-between sm:w-2/3">
                    <CardContent className="p-6">
                        <CardTitle className="text-2xl font-bold mb-4">
                            {movie.title}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2"/>
                                <span>
                                    {new Date(movie.release_date).getFullYear()}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-2"/>
                                <span>{movie.runtime} min</span>
                            </div>
                        </div>
                        <Badge variant="secondary" className="mb-4">
                            {movie.mpaa_rating}
                        </Badge>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {movie.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map((genre) => (
                                <Badge key={genre.id} variant="outline">
                                    {genre.genre}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                        <Button className="w-full" onClick={() => navigate(-1)}>
                            <ArrowLeft className="mr-2 h-4 w-4"/> Back
                        </Button>
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
};

export default MovieCard;
