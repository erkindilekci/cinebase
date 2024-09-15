import {useToast} from '@/hooks/use-toast';
import {useNavigate, useOutletContext, useParams} from 'react-router-dom';
import {z} from 'zod';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import MovieAddEditForm, {MovieFormSchema} from '../MovieAddEditForm';
import {OutletContextType} from './Login';
import MovieFormSkeleton from "@/components/MovieFormSkeleton";
import {fetchGenres, FormDataType} from '@/helper/addEditHelpers.ts';
import {Genre} from "@/components/pages/Genres.tsx";

const fetchMovie = async (id: string, jwtToken: string): Promise<FormDataType> => {
    const response = await fetch(`https://cinebase.erkindilekci.me/admin/movies/${id}`, {
        headers: {Authorization: `Bearer ${jwtToken}`}
    });
    if (!response.ok) {
        throw new Error('Failed to fetch movie data');
    }
    const data = await response.json();
    const formattedDate = new Date(data.release_date).toISOString().split('T')[0];
    return {
        ...data,
        release_date: formattedDate,
        genres: data.genres.map((g: Genre) => g.id)
    };
};

const EditMovie = () => {
    const {jwtToken} = useOutletContext<OutletContextType>();
    const {id} = useParams<{ id: string }>();
    const {toast} = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {data: movieData, isLoading: isMovieLoading} = useQuery({
        queryKey: ['movie', id],
        queryFn: () => fetchMovie(id!, jwtToken),
        enabled: !!id && !!jwtToken
    });

    const {data: genres, isLoading: isGenresLoading} = useQuery({
        queryKey: ['genres'],
        queryFn: fetchGenres
    });

    const updateMutation = useMutation({
        mutationFn: (data: z.infer<typeof MovieFormSchema>) => {
            data.release_date = new Date(data.release_date).toISOString().split("T")[0];

            return fetch(`https://cinebase.erkindilekci.me/admin/movies/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update movie');
                }
                return response.json();
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['movies']})
                .then(() => {
                    toast({title: 'Success', description: 'Movie updated successfully'});
                    navigate('/admin/movies');
                });
        },
        onError: (error: Error) => {
            toast({title: 'Error', description: error.message});
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => {
            return fetch(`https://cinebase.erkindilekci.me/admin/movies/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete movie');
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['movies']})
                .then(() => {
                    toast({title: 'Success', description: 'Movie deleted successfully'});
                    navigate('/admin/movies');
                });
        },
        onError: (error: Error) => {
            toast({title: 'Error', description: error.message});
        }
    });

    if (!jwtToken) {
        navigate('/login');
        return null;
    }

    const isLoading = isMovieLoading || isGenresLoading || updateMutation.isPending || deleteMutation.isPending;

    const handleSubmit = (data: z.infer<typeof MovieFormSchema>) => {
        updateMutation.mutate(data);
    };

    const handleDelete = () => {
        deleteMutation.mutate();
    };

    if (isLoading) {
        return (
            <div>
                <h2 className="text-center text-2xl font-bold mb-12">Edit Movie</h2>
                <MovieFormSkeleton/>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-center text-2xl font-bold mb-4">Edit Movie</h2>
            {movieData && genres && (
                <MovieAddEditForm
                    type="edit"
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                    defaultValues={movieData}
                    genres={genres}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default EditMovie;
