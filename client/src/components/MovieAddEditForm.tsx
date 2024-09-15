import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {Icons} from './icons';
import {Genre} from './pages/Genres';
import {Button} from './ui/button';
import {Checkbox} from './ui/checkbox';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from './ui/form';
import {Input} from './ui/input';
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from './ui/select';
import {Textarea} from './ui/textarea';

export const MovieFormSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, {message: 'Title is required.'}),
    release_date: z.string().min(1, {message: 'Release date is required.'}),
    runtime: z
        .number()
        .min(1, {message: 'Runtime must be a positive number.'}),
    mpaa_rating: z.string().min(1, {message: 'MPAA rating is required.'}),
    description: z.string().min(1, {message: 'Description is required.'}),
    image: z.string().optional(),
    genres: z
        .array(z.number())
        .min(1, {message: 'Select at least one genre.'})
});

export type MovieFormData = z.infer<typeof MovieFormSchema>;

interface MovieAddEditFormProps {
    type: 'add' | 'edit';
    isLoading: boolean;
    onSubmit: (data: MovieFormData) => void;
    defaultValues: MovieFormData;
    genres: Genre[];
    onDelete?: () => void;
}

const MovieAddEditForm = ({type, isLoading, onSubmit, defaultValues, genres, onDelete}: MovieAddEditFormProps) => {
    const form = useForm<MovieFormData>({
        resolver: zodResolver(MovieFormSchema),
        defaultValues
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                <FormField
                    control={form.control}
                    name="id"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    id="id"
                                    type="hidden"
                                    {...field}
                                    value={field.value?.toString()}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        id="title"
                                        placeholder="Movie Title"
                                        type="text"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="release_date"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Release Date</FormLabel>
                                <FormControl>
                                    <Input
                                        id="release_date"
                                        placeholder="YYYY-MM-DD"
                                        type="date"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="runtime"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Runtime (minutes)</FormLabel>
                                <FormControl>
                                    <Input
                                        id="runtime"
                                        placeholder="Runtime in minutes"
                                        type="number"
                                        disabled={isLoading}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value, 10)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mpaa_rating"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>MPAA Rating</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select MPAA Rating"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    MPAA Ratings
                                                </SelectLabel>
                                                <SelectItem value="G">
                                                    G - General Audiences
                                                </SelectItem>
                                                <SelectItem value="PG">
                                                    PG - Parental Guidance
                                                    Suggested
                                                </SelectItem>
                                                <SelectItem value="PG-13">
                                                    PG-13 - Parents Strongly
                                                    Cautioned
                                                </SelectItem>
                                                <SelectItem value="R">
                                                    R - Restricted
                                                </SelectItem>
                                                <SelectItem value="NC-17">
                                                    NC-17 - Adults Only
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Input
                                    id="image"
                                    placeholder="Movie Image"
                                    type="text"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="genres"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">
                                    Genres
                                </FormLabel>
                                <FormMessage/>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {genres.map((genre) => (
                                    <FormField
                                        key={genre.id}
                                        control={form.control}
                                        name="genres"
                                        render={({field}) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(genre.id)}
                                                        onCheckedChange={(checked) => {
                                                            const updatedGenres =
                                                                checked
                                                                    ? [...field.value, genre.id]
                                                                    : field.value.filter((id) => id !== genre.id);
                                                            field.onChange(
                                                                updatedGenres
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">{genre.genre}</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    id="description"
                                    placeholder="Movie Description"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {type === 'add'
                    ? <Button disabled={isLoading} type="submit">
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                        )}
                        Add Movie
                    </Button>
                    : <div className="flex flex-row space-x-16 justify-between items-center">
                        <Button variant="outline" className="flex-1" disabled={isLoading} type="button"
                                onClick={onDelete}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Delete Movie
                        </Button>
                        <Button className="flex-1" disabled={isLoading} type="submit">
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Edit Movie
                        </Button>
                    </div>
                }

            </form>
        </Form>
    );
};

export default MovieAddEditForm;
