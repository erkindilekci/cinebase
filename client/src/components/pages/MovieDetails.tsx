import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ErrorCard from '../ErrorCard';
import MovieCard from '../MovieCard';
import MovieCardSkeleton from '../MovieCardSkeleton';
import { Genre } from './Genres';

export interface Movie {
    id: number;
    title: string;
    release_date: string;
    runtime: number;
    mpaa_rating: string;
    description: string;
    image: string;
    genres: Genre[];
}

const fetchMovie = async (id: string): Promise<Movie> => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const requestOptions: RequestInit = { method: 'GET', headers: headers };

    const response = await fetch(`${process.env.BACKEND_URL}/movies/${id}`, requestOptions);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const MovieDetails = () => {
    const { id } = useParams();
    const {
        data: movie,
        error,
        isLoading
    } = useQuery<Movie, Error>({
        queryKey: ['movie', id],
        queryFn: () => fetchMovie(id!)
    });

    if (isLoading) {
        return <MovieCardSkeleton/>;
    }

    if (error) {
        return (
            <div className="w-full flex justify-center items-start">
                <ErrorCard alertDescription={error.message}/>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="w-full flex justify-center items-start">
                <ErrorCard alertDescription="No movie found"/>
            </div>
        );
    }

    return <MovieCard movie={movie}/>;
};

export default MovieDetails;
