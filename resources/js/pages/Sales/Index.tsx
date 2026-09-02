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
import { Box, Megaphone, Pencil, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { products} from '@/routes/sales';

interface Sale {
    id: number;
    sale: string | null;
    inventory: string | null;
    branch: string;
    shift: string;
    cash_advance: number | null;
    cash_shortage: number | null;
    remitted_expenses: number | null;
    cash_amount: number | null;
    gcash_amount: number | null;
    net_cash: number;
}


interface PaginatedSales {
    data: Sale[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface PageProps {
    sales: PaginatedSales;
    flash?: { success?: string; error?: string };
}


function SaleBranchBadge({ type }: { type: string }) {
    return (
        <span className="inline-flex items-center rounded-full border border-brand-orange/40 bg-[#fbead9] px-3 py-0.5 text-xs font-medium capitalize text-[#7a3b12]">
            {type}
        </span>
    );
}

function InOutTypeBadge({ type }: { type: string }) {
    return (
        <span className="inline-flex items-center rounded-full border border-red-300 bg-red-100 px-3 py-0.5 text-xs font-medium capitalize text-red-700">
            {type}
        </span>
    );
}

export default function Index() {
    // const { sales } = usePage().props as PageProps;
    const { sales, flash } = usePage<PageProps & Record<string, unknown>>().props as unknown as PageProps;

    const { processing, delete: destroyForm } = useForm();

    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState('10');

    const visibleSales = useMemo(
        () =>
            sales.filter((sale) =>
                sale.shift.toLowerCase().includes(search.toLowerCase()),
            ),
        [sales, search],
    );





    return (
        <div className="p-4">
            {flash?.success && (
                <div className="mb-4">
                    <Alert>
                        <Megaphone />
                        <AlertTitle>Notification</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                </div>
            )}
            {flash?.error && (
                <div className="mb-4">
                    <Alert variant="destructive">
                        <Megaphone />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                </div>
            )}
            <Head title="Sales" />

            <div className="p-6">


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






                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    Inventory
                                </TableHead>
                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    Branch
                                </TableHead>
                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    Shift
                                </TableHead>
                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    Cash Amount
                                </TableHead>
                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    Gcash Amount
                                </TableHead>
                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    Cash Advance
                                </TableHead>
                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    Cash Shortage
                                </TableHead> <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    Remitted Expenses
                                </TableHead>


                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    Net Cash
                                </TableHead>
                                <TableHead className="font-bold tracking-wide text-brand-orange-hover">
                                    Date
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleSales.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-10 text-center text-sm text-subtle">
                                        No sales found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {visibleSales.map((sale) => (
                                <TableRow
                                    key={sale.id}
                                    className="border-b border-[#f0ddc8] last:border-0 hover:bg-[#fbf3e8]"
                                >

                                    <TableCell className="font-medium text-[#7a3b12]">
                                        {sale.inventory}
                                    </TableCell>
                                    <TableCell className="font-medium text-[#7a3b12]">
                                        <SaleBranchBadge type={sale.branch} />

                                    </TableCell>
                                    <TableCell>
                                        <InOutTypeBadge type={sale.shift} />

                                    </TableCell>
                                    <TableCell className="text-right">

                                        {sale.cash_amount !== null ? `₱${sale.cash_amount}` : '—'}
                                    </TableCell>
                                    <TableCell className="text-right">

                                        {sale.gcash_amount !== null ? `₱${sale.gcash_amount}` : '—'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {sale.cash_advance !== null ? `₱${sale.cash_advance}` : '—'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {sale.cash_shortage !== null ? `₱${sale.cash_shortage}` : '—'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {sale.remitted_expenses !== null ? `₱${sale.remitted_expenses}` : '—'}

                                    </TableCell>
                                    <TableCell className="text-right">
                                        {sale.net_cash !== null ? `₱${sale.net_cash}` : '—'}

                                    </TableCell>
                                    {/* <TableCell>
                                        <div className="flex items-center justify-end gap-4">
                                            <Link
                                                href={products(sale.id).url}
                                                className="flex items-center gap-1 text-sm font-medium text-ink hover:text-brand-orange"
                                            >
                                                <Box className="h-4 w-4" />
                                                View Products
                                            </Link>
                                            <Link
                                                href={`/sales/${sale.id}/edit`}
                                                className="flex items-center gap-1 text-sm font-medium text-ink hover:text-brand-orange"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                disabled={processing}
                                                onClick={() => handleDelete(sale.id, sale.location)}
                                                className="flex items-center gap-1 text-sm font-medium text-ink hover:text-danger disabled:opacity-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                     {sales.links.length > 3 && (
                    <div className="flex gap-1 border-t border-[#f0ddc8] px-5 py-3">
                        {sales.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-md px-3 py-1 text-sm ${
                                    link.active
                                        ? 'bg-brand-orange text-white'
                                        : 'text-brand-orange-hover hover:bg-[#fbead9]'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            />
                        ))}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Sales',
            href: '/sales',
        },
    ],
};