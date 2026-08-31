import { createIn, createOut } from '@/routes/inventories';
import { Link, usePage } from '@inertiajs/react';

interface InventoryRow {
    id: number;
    type: string;
    inventory_type: string | null;
    branch: string | null;
    encoder: string | null;
    cash_amount: number | null;
    total_cash: number | null;
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
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Inventories</h1>
                <div className="flex gap-2">
                    <Link
                        href={createIn().url}
                        className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700"
                    >
                        + IN
                    </Link>
                    <Link
                        href={createOut().url}
                        className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                    >
                        + OUT
                    </Link>
                </div>
            </div>

            {flash?.success && (
                <div className="mb-4 rounded-md bg-green-50 text-green-700 px-4 py-2 text-sm">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">
                    {flash.error}
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                        <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Branch</th>
                            <th className="px-4 py-2">Inventory Type</th>
                            <th className="px-4 py-2">Encoder</th>
                            <th className="px-4 py-2">Cash on Hand</th>
                            <th className="px-4 py-2">Total Cash</th>
                            <th className="px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventories.data.map((inv) => (
                            <tr key={inv.id} className="border-t border-gray-100">
                                <td className="px-4 py-2">{inv.id}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                            inv.type === 'IN'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {inv.type}
                                    </span>
                                </td>
                                <td className="px-4 py-2">{inv.branch ?? '—'}</td>
                                <td className="px-4 py-2">{inv.inventory_type ?? '—'}</td>
                                <td className="px-4 py-2">{inv.encoder ?? '—'}</td>
                                <td className="px-4 py-2">
                                    {inv.cash_amount !== null ? `₱${inv.cash_amount}` : '—'}
                                </td>
                                <td className="px-4 py-2">
                                    {inv.total_cash !== null ? `₱${inv.total_cash}` : '—'}
                                </td>
                                <td className="px-4 py-2">{inv.created_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex gap-2">
                {inventories.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url ?? '#'}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1 rounded text-sm ${
                            link.active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                        } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
}