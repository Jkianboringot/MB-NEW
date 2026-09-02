import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowDownCircle, ArrowUpCircle, Megaphone } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { createIn, createOut } from '@/routes/inventories';

interface InventoryRow {
    id: number;
    type: string;
    inventory_type: string | null;
    stock_movement_type: string | null;
    branch: string | null;
    encoder: string | null;
    cash_amount: number | null;
    net_cash: number | null;
    created_at: string;
}

interface PaginatedInventories {
    data: InventoryRow[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface PageProps {
    inventories: PaginatedInventories;
    flash?: { success?: string; error?: string };
}

export default function Index() {
    const { inventories, flash } = usePage<PageProps & Record<string, unknown>>().props as unknown as PageProps;

    return (
        <div className="p-6">
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

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink">Inventories</h1>
                    {/* <p className="mt-1 text-sm text-subtle">Stock movements across all branches.</p> */}
                </div>
                <div className="flex gap-2">
                    <Link href={createIn().url}>
                        <Button className="bg-green-600 font-bold text-white hover:bg-green-700">
                            <ArrowDownCircle className="h-4 w-4" />
                            IN
                        </Button>
                    </Link>
                    <Link href={createOut().url}>

                        <Button className="bg-red-600 font-bold text-white hover:bg-red-700">
                            <ArrowUpCircle className="h-4 w-4" />
                            OUT
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#f0ddc8] bg-[#fdf8f2]">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#f0ddc8] bg-[#fbead9] hover:bg-[#fbead9]">
                            <TableHead>#</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Inventory Type</TableHead>
                            <TableHead>Encoder</TableHead>
                            <TableHead className="text-right">Cash on Hand</TableHead>
                            <TableHead className="text-right">Total Cash</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventories.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="py-10 text-center text-sm text-subtle">
                                    No inventory records yet.
                                </TableCell>
                            </TableRow>
                        )}
                        {inventories.data.map((inv) => (
                            <TableRow
                                key={inv.id}
                                className="border-b border-[#f0ddc8] last:border-0 hover:bg-[#fbf3e8]"
                            >
                                <TableCell className="text-subtle">{inv.id}</TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                            inv.inventory_type === 'IN'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {inv.inventory_type}
                                    </span>
                                </TableCell>
                                <TableCell className="font-medium text-[#7a3b12]">{inv.branch ?? '—'}</TableCell>
                                <TableCell>{inv.stock_movement_type ?? '—'}</TableCell>
                                <TableCell>{inv.encoder ?? '—'}</TableCell>
                                <TableCell className="text-right">
                                    {inv.cash_amount !== null ? `₱${inv.cash_amount}` : '—'}
                                </TableCell>
                                <TableCell className="text-right font-medium text-[#7a3b12]">
                                    {inv.net_cash !== null ? `₱${inv.net_cash}` : '—'}
                                </TableCell>
                                <TableCell className="text-subtle">{inv.created_at}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

{/* SECURITY - the dangerouslySetInnerHTML is bad becuase it does not stop xxs, remove that and change it to something else*/}
                {inventories.links.length > 3 && (
                    <div className="flex gap-1 border-t border-[#f0ddc8] px-5 py-3">
                        {inventories.links.map((link, i) => (
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
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Inventories',
            href: '/inventories',
        },
    ],
};