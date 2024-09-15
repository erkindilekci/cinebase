import {useEffect, useState} from 'react';
import {useNavigate, useOutletContext} from 'react-router-dom';
import {OutletContextType} from './Login';
import {Movie} from './MovieDetails';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table';

const ManageCatalogue = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const {jwtToken} = useOutletContext<OutletContextType>();
    const navigate = useNavigate();

    useEffect(() => {
        if (jwtToken === '') {
            navigate('/login');
            return;
        }

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${localStorage.getItem("token")}`);

        const requestOptions = {method: 'GET', headers: headers};

        fetch('https://cinebase.erkindilekci.me/admin/movies', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: Movie[]) => {
                setMovies(data);
            })
            .catch((err) => {
                console.error('Fetch error:', err);
            });
    }, [jwtToken, navigate]);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">Title</TableHead>
                    <TableHead className="text-xs">Release Date</TableHead>
                    <TableHead className="text-xs">Runtime</TableHead>
                    <TableHead className="text-xs">Mpaa Rating</TableHead>
                    <TableHead className="text-xs">Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {movies.map((movie) => (
                    <TableRow
                        key={movie.id}
                        onClick={() => {
                            navigate(`/admin/movies/${movie.id}`);
                        }}
                        className="cursor-pointer"
                    >
                        <TableCell className="text-xs">{movie.id}</TableCell>
                        <TableCell className="text-xs">{movie.title}</TableCell>
                        <TableCell className="text-xs">{movie.release_date}</TableCell>
                        <TableCell className="text-xs">{movie.runtime}</TableCell>
                        <TableCell className="text-xs">{movie.mpaa_rating}</TableCell>
                        <TableCell className="w-2/3 text-xs">{movie.description}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
export default ManageCatalogue;
