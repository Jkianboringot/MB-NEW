import { createIn, createOut } from '@/routes/inventories';
import { Link, usePage } from '@inertiajs/react';

interface InventoryRow {
    id: number;
    type: string;
    inventory_type: string | null;
    stock_movement_type: string | null;
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
        <div className="mx-4 max-w-6xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Inventories</h1>
                    <p className="mt-1 text-sm text-gray-500">Stock movements across all branches.</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={createIn().url}
                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                        + IN
                    </Link>
                    <Link
                        href={createOut().url}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        + OUT
                    </Link>
                </div>
            </div>

            {flash?.success && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                    {flash.error}
                </div>
            )}

            <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">#</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Branch</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Inventory Type</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Encoder</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-500">Cash on Hand</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-500">Total Cash</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {inventories.data.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-500">{inv.id}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                inv.inventory_type === 'IN'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {inv.inventory_type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-900">{inv.branch ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-700">{inv.stock_movement_type ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-700">{inv.encoder ?? '—'}</td>
                                    <td className="px-4 py-3 text-right text-gray-900">
                                        {inv.cash_amount !== null ? `₱${inv.cash_amount}` : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                                        {inv.total_cash !== null ? `₱${inv.total_cash}` : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{inv.created_at}</td>
                                </tr>
                            ))}
                            {inventories.data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">
                                        No inventory records yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {inventories.links.length > 3 && (
                    <div className="flex gap-1 border-t border-gray-100 px-4 py-3">
                        {inventories.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-md px-3 py-1 text-sm ${
                                    link.active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}