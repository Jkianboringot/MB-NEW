import { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Box, Pencil, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { products,deleteMethod } from '@/routes/branches';

interface Branch {
    id: number;
    location: string;
    branch_type: string;
    products_count: number;
}

interface PageProps {
    branches: Branch[];
}

function BranchTypeBadge({ type }: { type: string }) {
    return (
        <span className="inline-flex items-center rounded-full border border-brand-orange/40 bg-[#fbead9] px-3 py-0.5 text-xs font-medium capitalize text-[#7a3b12]">
            {type}
        </span>
    );
}

export default function Index() {
    const { branches } = usePage().props as PageProps;

    const { processing, delete: destroyForm } = useForm();

    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState('10');

    const visibleBranches = useMemo(
        () =>
            branches.filter((branch) =>
                branch.location.toLowerCase().includes(search.toLowerCase()),
            ),
        [branches, search],
    );

    const toggleSelected = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const handleDelete = (id: number, location: string) => {
        if (confirm(`Delete "${location}"? This can't be undone.`)) {
            destroyForm(deleteMethod(id).url);
        }
    };

    return (
        <>
            <Head title="Branches" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink">
                        Branches
                    </h1>
                    <Link href={'/branches/create'}>
                        <Button className="bg-brand-orange font-bold text-white hover:bg-brand-orange-hover">
                            New branch
                        </Button>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#f0ddc8] bg-[#fdf8f2]">
                    <div className="flex items-center justify-end gap-3 border-b border-[#f0ddc8] px-5 py-3">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-orange" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search"
                                className="w-56 border-brand-orange/40 bg-white pl-9 text-sm"
                            />
                        </div>
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-brand-orange/40 bg-white text-brand-orange"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                        </button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-[#f0ddc8] bg-[#fbead9] hover:bg-[#fbead9]">
                                <TableHead className="w-10">
                                    <Checkbox
                                        checked={
                                            selected.length === visibleBranches.length &&
                                            visibleBranches.length > 0
                                        }
                                        onCheckedChange={(checked) =>
                                            setSelected(
                                                checked
                                                    ? visibleBranches.map((b) => b.id)
                                                    : [],
                                            )
                                        }
                                    />
                                </TableHead>
                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    LOCATION
                                </TableHead>
                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    BRANCH TYPE
                                </TableHead>
                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    PRODUCTS
                                </TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleBranches.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-10 text-center text-sm text-subtle">
                                        No branches found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {visibleBranches.map((branch) => (
                                <TableRow
                                    key={branch.id}
                                    className="border-b border-[#f0ddc8] last:border-0 hover:bg-[#fbf3e8]"
                                >
                                    <TableCell>
                                        <Checkbox
                                            checked={selected.includes(branch.id)}
                                            onCheckedChange={() => toggleSelected(branch.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium text-[#7a3b12]">
                                        {branch.location}
                                    </TableCell>
                                    <TableCell>
                                        <BranchTypeBadge type={branch.branch_type} />
                                    </TableCell>
                                    <TableCell>{branch.products_count}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-4">
                                            <Link
                                                href={products(branch.id).url}
                                                className="flex items-center gap-1 text-sm font-medium text-ink hover:text-brand-orange"
                                            >
                                                <Box className="h-4 w-4" />
                                                View Products
                                            </Link>
                                            <Link
                                                href={`/branches/${branch.id}/edit`}
                                                className="flex items-center gap-1 text-sm font-medium text-ink hover:text-brand-orange"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                disabled={processing}
                                                onClick={() => handleDelete(branch.id, branch.location)}
                                                className="flex items-center gap-1 text-sm font-medium text-ink hover:text-danger disabled:opacity-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-between px-5 py-3 text-sm text-brand-orange">
                        <span>
                            Showing 1 to {visibleBranches.length} of {branches.length} results
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-subtle">Per page</span>
                            <Select value={perPage} onValueChange={setPerPage}>
                                <SelectTrigger className="w-20 border-brand-orange/40 bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Branches',
            href: '/branches',
        },
    ],
};