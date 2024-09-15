import {Genre} from "@/components/pages/Genres.tsx";

export interface FormDataType {
    id?: number;
    title: string;
    release_date: string;
    runtime: number;
    mpaa_rating: string;
    description: string;
    image: '',
    genres: number[];
}

export const fetchGenres = async (): Promise<Genre[]> => {
    const response = await fetch('https://cinebase.erkindilekci.me/genres');
    if (!response.ok) {
        throw new Error('Failed to fetch genres');
    }
    return response.json();
};

export const defaultMovieValues: FormDataType = {
    id: undefined,
    title: '',
    release_date: '',
    runtime: 0,
    mpaa_rating: '',
    description: '',
    image: '',
    genres: []
};
