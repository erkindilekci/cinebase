import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App.tsx';
import ErrorPage from './components/pages/ErrorPage.tsx';
import Genres from './components/pages/Genres.tsx';
import Graphql from './components/pages/Graphql.tsx';
import Home from './components/pages/Home.tsx';
import Login from './components/pages/Login.tsx';
import ManageCatalogue from './components/pages/ManageCatalogue.tsx';
import MovieDetails from './components/pages/MovieDetails.tsx';
import Movies from './components/pages/Movies.tsx';
import Signup from './components/pages/Signup.tsx';
import './index.css';
import AddMovie from "@/components/pages/AddMovie.tsx";
import EditMovie from "@/components/pages/EditMovie.tsx";
import OneGenreMovies from "@/components/pages/OneGenreMovies.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 15000
        }
    }
});

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {index: true, element: <Home/>},
            {path: '/movies', element: <Movies/>},
            {path: '/movies/:id', element: <MovieDetails/>},
            {path: '/genres', element: <Genres/>},
            {path: '/genres/:id', element: <OneGenreMovies/>},
            {path: '/admin/movies', element: <ManageCatalogue/>},
            {path: '/admin/movies/0', element: <AddMovie/>},
            {path: '/admin/movies/:id', element: <EditMovie/>},
            {path: '/graphql', element: <Graphql/>},
            {path: '/signup', element: <Signup/>},
            {path: '/login', element: <Login/>}
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    </StrictMode>
);
