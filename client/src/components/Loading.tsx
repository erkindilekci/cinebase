import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
}

const Loading = ({ size = 'md', className, ...props }: SpinnerProps) => {
    return (
        <div
            className={cn(
                'flex items-center justify-center',
                {
                    'w-6 h-6': size === 'sm',
                    'w-8 h-8': size === 'md',
                    'w-12 h-12': size === 'lg'
                },
                className
            )}
            {...props}
        >
            <Loader2
                className={cn('animate-spin text-primary', {
                    'w-4 h-4': size === 'sm',
                    'w-6 h-6': size === 'md',
                    'w-8 h-8': size === 'lg'
                })}
            />
        </div>
    );
};

export default Loading;
