import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from './ui/button';

interface NavProps {
    links: {
        title: string;
        label?: string;
        icon?: LucideIcon;
        variant: 'default' | 'ghost';
        to: string;
    }[];
    onLinkClick: (path: string) => void;
}

const Nav = ({ links, onLinkClick }: NavProps) => {
    return (
        <div
            data-collapsed={false}
            className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
        >
            <nav className="grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        to={link.to}
                        className={cn(
                            buttonVariants({
                                variant: link.variant,
                                size: 'default'
                            }),
                            link.variant === 'default' &&
                            'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                            'justify-start'
                        )}
                        onClick={() => onLinkClick(link.to)}
                    >
                        {link.icon !== undefined ? (
                            <link.icon className="mr-2 h-4 w-4"/>
                        ) : null}
                        {link.title}
                        {link.label && (
                            <span
                                className={cn(
                                    'ml-auto',
                                    link.variant === 'default' &&
                                    'text-background dark:text-white'
                                )}
                            >
                                {link.label}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Nav;
