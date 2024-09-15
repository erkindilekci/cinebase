import { useToast } from '@/hooks/use-toast';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MovieAddEditForm, { MovieFormSchema } from '../MovieAddEditForm';
import { OutletContextType } from './Login';
import MovieFormSkeleton from "@/components/MovieFormSkeleton";
import { defaultMovieValues, fetchGenres } from '../../helper/addEditHelpers.ts';
import * as process from "node:process";

const AddMovie = () => {
    const { jwtToken } = useOutletContext<OutletContextType>();
    const { toast } = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: genres, isLoading: isGenresLoading } = useQuery({
        queryKey: ['genres'],
        queryFn: fetchGenres
    });

    const mutation = useMutation({
        mutationFn: (data: z.infer<typeof MovieFormSchema>) => {
            data.release_date = new Date(data.release_date).toISOString().split("T")[0];

            return fetch(`${process.env.BACKEND_URL}/admin/movies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add movie');
                }
                return response.json();
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            toast({
                title: 'Success',
                description: 'Movie added successfully'
            });
            navigate('/admin/movies');
        },
        onError: (error: Error) => {
            toast({ title: 'Error', description: error.message });
        }
    });

    if (!jwtToken) {
        navigate('/login');
        return null;
    }

    const isLoading = isGenresLoading || mutation.isPending;

    const handleSubmit = (data: z.infer<typeof MovieFormSchema>) => {
        mutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div>
                <h2 className="text-center text-2xl font-bold mb-12">Add Movie</h2>
                <MovieFormSkeleton/>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-center text-2xl font-bold mb-4">Add Movie</h2>
            {genres && (
                <MovieAddEditForm
                    type="add"
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                    defaultValues={defaultMovieValues}
                    genres={genres}
                />
            )}
        </div>
    );
};

export default AddMovie;
