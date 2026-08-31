import AdminLayout from '@/layouts/AdminLayout';
import { createIn, createOut } from '@/routes/inventories';
import { Link } from '@inertiajs/react';
import { ArrowDownToLine, ArrowUpFromLine, Search } from 'lucide-react';

interface InventoryRow {
    id: number;
    inventory_type: string;
    type: string;
    branch: string | null;
    encoder: string | null;
    cash_amount: number | null;
    total_cash: number | null;
}

interface Props {
    inventories: { data: InventoryRow[]; total: number };
}

export default function Index({ inventories }: Props) {
    return (
        <AdminLayout title="Inventories">
            <div className="mb-4 flex justify-end gap-2">
                <Link
                    href={createIn().url}
                    className="flex items-center gap-1.5 rounded-lg bg-success px-4 py-2 text-sm font-bold text-white hover:bg-[#2f855a]"
                >
                    <ArrowDownToLine size={16} /> IN
                </Link>
                <Link
                    href={createOut().url}
                    className="flex items-center gap-1.5 rounded-lg bg-danger px-4 py-2 text-sm font-bold text-white hover:bg-[#c53030]"
                >
                    <ArrowUpFromLine size={16} /> OUT
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-card">
                <div className="flex justify-end border-b border-[#f0e8dc] p-3">
                    <div className="relative w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full rounded-lg border border-[#e0d0c0] py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-orange"
                        />
                    </div>
                </div>

                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-[#faf6f1] text-left text-xs font-semibold text-ink">
                            <th className="border-b-2 border-[#f0e8dc] px-4 py-3">#</th>
                            <th className="border-b-2 border-[#f0e8dc] px-4 py-3">Inventory type</th>
                            <th className="border-b-2 border-[#f0e8dc] px-4 py-3">Branch</th>
                            <th className="border-b-2 border-[#f0e8dc] px-4 py-3">Type</th>
                            <th className="border-b-2 border-[#f0e8dc] px-4 py-3">Encoder</th>
                            <th className="border-b-2 border-[#f0e8dc] px-4 py-3">Cash</th>
                            <th className="border-b-2 border-[#f0e8dc] px-4 py-3">Total Cash</th>
                            <th className="border-b-2 border-[#f0e8dc] px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventories.data.map((inv) => (
                            <tr key={inv.id} className="hover:bg-[#fef9f2]">
                                <td className="border-b border-[#f0ebe3] px-4 py-3 text-subtle">{inv.id}</td>
                                <td className="border-b border-[#f0ebe3] px-4 py-3">
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                            inv.inventory_type === 'in'
                                                ? 'bg-success/10 text-success'
                                                : 'bg-danger/10 text-danger'
                                        }`}
                                    >
                                        {inv.inventory_type}
                                    </span>
                                </td>
                                <td className="border-b border-[#f0ebe3] px-4 py-3">{inv.branch ?? '—'}</td>
                                <td className="border-b border-[#f0ebe3] px-4 py-3">{inv.type}</td>
                                <td className="border-b border-[#f0ebe3] px-4 py-3">{inv.encoder ?? '—'}</td>
                                <td className="border-b border-[#f0ebe3] px-4 py-3">{inv.cash_amount ?? '—'}</td>
                                <td className="border-b border-[#f0ebe3] px-4 py-3">{inv.total_cash ?? '—'}</td>
                                <td className="border-b border-[#f0ebe3] px-4 py-3 text-right">
                                    <button className="text-sm font-semibold text-ink hover:text-brand-orange">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex items-center justify-between px-4 py-3 text-xs text-subtle">
                    <span>
                        Showing {inventories.data.length} result{inventories.data.length !== 1 && 's'}
                    </span>
                </div>
            </div>
        </AdminLayout>
    );
}