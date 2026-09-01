import { storeOut } from '@/routes/inventories';
import { useForm } from '@inertiajs/react';
import { FormEvent, useMemo } from 'react';

interface Product {
    id: number;
    name: string;
    quantity: number;
}

interface Branch {
    id: number;
    location: string;
    products: Product[];
}

interface ProductRow {
    product_id: number | '';
    quantity: number;
}

interface Props {
    branches: Branch[];
}

const inputClass =
    'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-400';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

export default function CreateOut({ branches }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        branch_id: number | '';
        productList: ProductRow[];
        shift: string;
        cash_amount: number;
        sale_short: number;
        gcash_amount: number;
        cash_advance: number;
        remitted_expenses: number;
        net_cash: number;
    }>({
        branch_id: '',
        productList: [{ product_id: '', quantity: 1 }],
        shift: '',
        cash_amount: 0,
        sale_short: 0,
        gcash_amount: 0,
        cash_advance: 0,
        remitted_expenses: 0,
        net_cash: 0,
    });

    const selectedBranch = useMemo(
        () => branches.find((b) => b.id === data.branch_id),
        [branches, data.branch_id],
    );

    const total_cash = useMemo(() => {
        return (
            Number(data.cash_amount) +
            Number(data.gcash_amount) +
            Number(data.cash_advance) +
            Number(data.remitted_expenses) -
            Number(data.sale_short)
        );
    }, [data.cash_amount, data.gcash_amount, data.cash_advance, data.remitted_expenses, data.sale_short]);

    function handleBranchChange(branchId: number) {
        setData((prev) => ({
            ...prev,
            branch_id: branchId,
            // reset product rows — stock differs per branch
            productList: [{ product_id: '', quantity: 1 }],
        }));
    }

    function addRow() {
        setData('productList', [...data.productList, { product_id: '', quantity: 1 }]);
    }

    function removeRow(index: number) {
        setData(
            'productList',
            data.productList.filter((_, i) => i !== index),
        );
    }

    function updateRow(index: number, key: keyof ProductRow, value: string | number) {
        const rows = [...data.productList];
        rows[index] = { ...rows[index], [key]: value };
        setData('productList', rows);
    }

    function stockFor(productId: number | ''): number | null {
        if (productId === '' || !selectedBranch) return null;
        return selectedBranch.products.find((p) => p.id === productId)?.quantity ?? 0;
    }

    // ids already picked in other rows, so the same product can't be
    // sold twice in one submission
    function pickedElsewhere(index: number): number[] {
        return data.productList
            .filter((_, i) => i !== index)
            .map((r) => r.product_id)
            .filter((id): id is number => id !== '');
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        setData('net_cash', total_cash);
        post(storeOut().url, {
            data: {
                ...data
            },
        });
    }

    return (
        <div className="mx-4 max-w-6xl p-6">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Inventory Out</h1>
            </div>

            <form onSubmit={submit} className="w-full">
                <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    {/* Branch */}
                    <div className="border-b border-gray-100 p-6">
                        <h2 className="mb-4 text-sm font-semibold text-gray-900">Branch</h2>
                        <select
                            className={inputClass}
                            value={data.branch_id}
                            onChange={(e) => handleBranchChange(Number(e.target.value))}
                        >
                            <option value="">Select a branch…</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.location}
                                </option>
                            ))}
                        </select>
                        {errors.branch_id && <p className="mt-1.5 text-sm text-red-600">{errors.branch_id}</p>}
                    </div>

                    {/* Products sold */}
                    <div className="border-b border-gray-100 p-6">
                        <div className="mb-1 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Products Sold</h2>
                            <button
                                type="button"
                                onClick={addRow}
                                disabled={!selectedBranch}
                                className="text-sm font-medium text-orange-600 hover:text-orange-700 disabled:opacity-40"
                            >
                                + Add Product
                            </button>
                        </div>
                        <p className="mb-4 text-xs text-gray-500">Only products already stocked at the selected branch can be sold.</p>

                        <div className="space-y-3">
                            {data.productList.map((row, i) => {
                                const excluded = pickedElsewhere(i);
                                const stock = stockFor(row.product_id);

                                return (
                                    <div
                                        key={i}
                                        className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50/60 p-3 sm:flex-row sm:items-start"
                                    >
                                        <select
                                            className={`${inputClass} flex-1`}
                                            value={row.product_id}
                                            disabled={!selectedBranch}
                                            onChange={(e) => updateRow(i, 'product_id', Number(e.target.value))}
                                        >
                                            <option value="">
                                                {selectedBranch ? 'Select product…' : 'Select a branch first…'}
                                            </option>
                                            {selectedBranch?.products
                                                .filter((p) => !excluded.includes(p.id))
                                                .map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name} ({p.quantity} in stock)
                                                    </option>
                                                ))}
                                        </select>

                                        <input
                                            type="number"
                                            disabled
                                            value={stock ?? ''}
                                            placeholder="In stock"
                                            className={`${inputClass} sm:w-28`}
                                        />

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max={stock ?? undefined}
                                            className={`${inputClass} sm:w-28`}
                                            placeholder="Qty sold"
                                            value={row.quantity}
                                            onChange={(e) => updateRow(i, 'quantity', Number(e.target.value))}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeRow(i)}
                                            disabled={data.productList.length === 1}
                                            className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        {errors.productList && <p className="mt-2 text-sm text-red-600">{errors.productList}</p>}
                    </div>

                    {/* Cash summary */}
                    <div className="p-6">
                        <h2 className="mb-4 text-sm font-semibold text-gray-900">Cash Summary</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Shift</label>
                                <select
                                    className={`${inputClass} sm:max-w-xs`}
                                    value={data.shift}
                                    onChange={(e) => setData('shift', e.target.value)}
                                >
                                    <option value="">Select shift…</option>
                                    <option value="opening">Opening</option>
                                    <option value="closing">Closing</option>
                                </select>
                                {errors.shift && <p className="mt-1.5 text-sm text-red-600">{errors.shift}</p>}
                            </div>

                            <MoneyField label="Cash on Hand" value={data.cash_amount} onChange={(v) => setData('cash_amount', v)} error={errors.cash_amount} />
                            <MoneyField label="Cash Shortage" value={data.sale_short} onChange={(v) => setData('sale_short', v)} error={errors.sale_short} />
                            <MoneyField label="Gcash" value={data.gcash_amount} onChange={(v) => setData('gcash_amount', v)} error={errors.gcash_amount} />
                            <MoneyField label="Cash Advance" value={data.cash_advance} onChange={(v) => setData('cash_advance', v)} error={errors.cash_advance} />
                            <MoneyField label="Remitted Expenses" value={data.remitted_expenses} onChange={(v) => setData('remitted_expenses', v)} error={errors.remitted_expenses} />
                        </div>

                        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                            <span className="text-sm font-medium text-gray-700">Total</span>
                            <span className="text-base font-semibold text-gray-900">₱{total_cash.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end border-t border-gray-100 bg-gray-50/60 px-6 py-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving…' : 'Save Sale'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

function MoneyField({
    label,
    value,
    onChange,
    error,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    error?: string;
}) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-400">₱</span>
                <input
                    type="number"
                    step="0.01"
                    className={`${inputClass} pl-7`}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                />
            </div>
            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}