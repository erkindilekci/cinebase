import {useQuery} from '@tanstack/react-query';
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table';
import {ChevronDownIcon} from 'lucide-react';
import * as React from 'react';
import {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ErrorCard from '../ErrorCard';
import Loading from '../Loading';
import {Button} from '../ui/button';
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger} from '../ui/dropdown-menu';
import {Input} from '../ui/input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table';
import {Movie} from './MovieDetails';
import {movieColumns} from "@/components/pages/Movies.tsx";
import {Icons} from "@/components/icons.tsx";

const fetchMovies = async (genreId: number): Promise<Movie[]> => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const requestOptions: RequestInit = {method: 'GET', headers: headers};

    const response = await fetch(`https://cinebase.erkindilekci.me/movies?genre=${genreId}`, requestOptions);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Unexpected response format: ${text}`);
    }

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

const OneGenreMovies = () => {
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        if (id === null) {
            navigate(-1);
        }
    }, [id, navigate]);

    const {
        data: movies,
        isLoading,
        error
    } = useQuery<Movie[], Error>({
        queryKey: ['movies', id],
        queryFn: () => fetchMovies(+id!)
    });

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: movies || [],
        columns: movieColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        },
        initialState: {
            pagination: {
                pageSize: 5
            }
        }
    });

    if (isLoading) {
        return (
            <div className="w-full h-full flex justify-center items-start">
                <Loading size="lg"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-start">
                <ErrorCard alertDescription={error.message}/>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter titles..."
                    value={
                        (table
                            .getColumn('title')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('title')
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <div className="flex items-center ml-auto">
                    <Button variant="link" disabled={isLoading} className="" type="button" onClick={() => navigate(-1)}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                        )}
                        Back to all genres
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Columns <ChevronDownIcon className="ml-2 h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table className="text-[0.83rem]">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    onClick={() => {
                                        navigate(`/movies/${row.original.id}`);
                                    }}
                                    className="cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={movieColumns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-center space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OneGenreMovies;
