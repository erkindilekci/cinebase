import {useEffect, useState} from 'react';
import {Link, Outlet, useNavigate} from 'react-router-dom';
import Nav from './components/Nav';
import {Button} from './components/ui/button';
import {Toaster} from './components/ui/toaster';

interface LinkType {
    title: string;
    variant: 'default' | 'ghost';
    to: string;
}

function App() {
    const [jwtToken, setJwtToken] = useState('');
    const [selectedLink, setSelectedLink] = useState('/');
    const navigate = useNavigate();

    useEffect(() => {
        const tokenValue = localStorage.getItem('token');
        if (tokenValue && tokenValue !== "") {
            setJwtToken(tokenValue);
        }
    }, [setJwtToken]);

    const handleLinkClick = (path: string) => {
        setSelectedLink(() => path);
    };

    const handleLogout = async () => {
        localStorage.removeItem("token");
        setJwtToken('');
        navigate('/login');
    };

    const baseLinks: LinkType[] = [
        {
            title: 'Home',
            variant: selectedLink === '/' ? 'default' : 'ghost',
            to: '/'
        },
        {
            title: 'Movies',
            variant: selectedLink === '/movies' ? 'default' : 'ghost',
            to: '/movies'
        },
        {
            title: 'Genres',
            variant: selectedLink === '/genres' ? 'default' : 'ghost',
            to: '/genres'
        }
    ];

    const adminLinks: LinkType[] = [
        {
            title: 'Add Movie',
            variant: selectedLink === '/admin/movies/0' ? 'default' : 'ghost',
            to: '/admin/movies/0'
        },
        {
            title: 'Manage Catalogue',
            variant: selectedLink === '/admin/movies' ? 'default' : 'ghost',
            to: '/admin/movies'
        },
        {
            title: 'GraphQL',
            variant: selectedLink === '/graphql' ? 'default' : 'ghost',
            to: '/graphql'
        }
    ];

    const links = jwtToken === '' ? baseLinks : [...baseLinks, ...adminLinks];

    return (
        <div className="my-8 mx-16">
            <div className="flex flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Cinebase</h1>
                {jwtToken === '' ? (
                    <Link to="/login">
                        <Button>Login</Button>
                    </Link>
                ) : (
                    <Button onClick={handleLogout}>Logout</Button>
                )}
            </div>

            <div className="flex flex-row">
                <Nav links={links} onLinkClick={handleLinkClick}/>
                <div className="flex-1 pl-8">
                    <Outlet context={{jwtToken, setJwtToken}}/>
                    <Toaster/>
                </div>
            </div>
        </div>
    );
}

export default App;
