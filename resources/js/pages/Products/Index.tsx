import { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    ChevronDown,
    Megaphone,
    Pencil,
    Search,
    SlidersHorizontal,
    Trash2,
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface PageProps {
    flash: {
        message?: string;
    };
    products: Product[];
}

interface Product {
    id: number;
    name: string;
    price: number;
    cost: number;
}

type SortKey = 'name' | 'price' | 'cost';
type SortDirection = 'asc' | 'desc';

function formatCurrency(value: number) {
    return Number(value).toFixed(2);
}

export default function Index() {
    const { flash, products } = usePage().props as PageProps;

    const { processing, delete: destroy } = useForm();

    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const visibleProducts = useMemo(() => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase()),
        );

        return filtered.sort((a, b) => {
            const dir = sortDirection === 'asc' ? 1 : -1;
            if (sortKey === 'price') {
                return (a.price - b.price) * dir;
            }
            if (sortKey === 'cost') {
                return (a.cost - b.cost) * dir;
            }
            return a.name.localeCompare(b.name) * dir;
        });
    }, [products, search, sortKey, sortDirection]);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete "${name}"? This can't be undone.`)) {
            destroy(route('products.delete', id));
        }
    };

    const sortIcon = (key: SortKey) => (
        <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${
                sortKey === key && sortDirection === 'desc' ? 'rotate-180' : ''
            }`}
        />
    );

    return (
        <>
            <Head title="Products" />

            <div className="p-6">
                {flash.message && (
                    <div className="mb-4">
                        <Alert>
                            <Megaphone />
                            <AlertTitle>Notification</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink">
                        Products
                    </h1>
                    <Link href={'/products/create'}>
                        <Button className="bg-brand-orange font-bold text-white hover:bg-brand-orange-hover">
                            New product
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
                       
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-[#f0ddc8] bg-[#fbead9] hover:bg-[#fbead9]">
                                <TableHead>
                                    <button
                                        type="button"
                                        onClick={() => toggleSort('name')}
                                        className="flex items-center gap-1 font-bold text-brand-orange-hover"
                                    >
                                        Name
                                        {sortIcon('name')}
                                    </button>
                                </TableHead>
                                <TableHead className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => toggleSort('price')}
                                        className="mx-auto flex items-center gap-1 font-bold text-brand-orange-hover"
                                    >
                                        Price
                                        {sortIcon('price')}
                                    </button>
                                </TableHead>
                                <TableHead className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => toggleSort('cost')}
                                        className="mx-auto flex items-center gap-1 font-bold text-brand-orange-hover"
                                    >
                                        Cost
                                        {sortIcon('cost')}
                                    </button>
                                </TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleProducts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-10 text-center text-sm text-subtle">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {visibleProducts.map((product) => (
                                <TableRow
                                    key={product.id}
                                    className="border-b border-[#f0ddc8] last:border-0 hover:bg-[#fbf3e8]"
                                >
                                    <TableCell className="font-medium text-[#7a3b12]">
                                        {product.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {formatCurrency(product.price)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {formatCurrency(product.cost)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-4">
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="flex items-center gap-1 text-sm font-medium text-ink hover:text-brand-orange"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                disabled={processing}
                                                onClick={() => handleDelete(product.id, product.name)}
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
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Product',
            href: '/products',
        },
    ],
};