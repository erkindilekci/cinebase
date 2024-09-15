import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {Button} from './ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from './ui/form';
import {Input} from './ui/input';
import {Icons} from './icons';

const FormSchema = z.object({
    email: z.string().email({message: 'Invalid email address.'}),
    password: z
        .string()
        .min(6, {message: 'Password must be at least 6 characters.'})
});

interface UserAuthFormProps {
    buttonLabel: string;
    isLoading: boolean;
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
}

const UserAuthForm = ({buttonLabel, isLoading, onSubmit}: UserAuthFormProps) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    id="email"
                                    placeholder="erkin@admin.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
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
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    id="password"
                                    placeholder="Test1234"
                                    type="password"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button disabled={isLoading} type="submit">
                    {isLoading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                    )}
                    {buttonLabel}
                </Button>
            </form>
            {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={isLoading}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}{' '}
                Google
            </Button> */}
        </Form>
    );
};

export default UserAuthForm;
