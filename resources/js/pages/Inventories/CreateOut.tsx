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

export default function CreateOut({ branches }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        branch_id: number | '';
        productList: ProductRow[];
        shift: string;
        cash_amount: number;
        sale_short: number;
        gcash_amount: number;
        cash_advance: number;
        adv_collection: number;
        remitted_expenses: number;
    }>({
        branch_id: '',
        productList: [{ product_id: '', quantity: 1 }],
        shift: '',
        cash_amount: 0,
        sale_short: 0,
        gcash_amount: 0,
        cash_advance: 0,
        adv_collection: 0,
        remitted_expenses: 0,
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
            Number(data.adv_collection) -
            Number(data.remitted_expenses) -
            Number(data.sale_short)
        );
    }, [data.cash_amount, data.gcash_amount, data.cash_advance, data.adv_collection, data.remitted_expenses, data.sale_short]);

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
        post(storeOut().url, {
            data: {
                ...data,
                total_cash,
            },
        });
    }

    return (
        <div className="mx-auto max-w-3xl p-6">
            <h1 className="mb-6 text-2xl font-semibold">Stock Out</h1>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="mb-1 block text-sm font-medium">Branch</label>
                    <select
                        className="w-full rounded-md border-gray-300"
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
                    {errors.branch_id && <p className="mt-1 text-sm text-red-600">{errors.branch_id}</p>}
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="font-medium">Products Sold</h2>
                        <button
                            type="button"
                            onClick={addRow}
                            disabled={!selectedBranch}
                            className="text-sm text-blue-600 hover:underline disabled:opacity-40"
                        >
                            + Add Product
                        </button>
                    </div>
                    <p className="mb-2 text-xs text-gray-500">
                        Only products already stocked at the selected branch can be sold.
                    </p>

                    <div className="space-y-2">
                        {data.productList.map((row, i) => {
                            const excluded = pickedElsewhere(i);
                            const stock = stockFor(row.product_id);

                            return (
                                <div key={i} className="flex items-start gap-2">
                                    <select
                                        className="flex-1 rounded-md border-gray-300"
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
                                        placeholder="In Stock"
                                        className="w-28 rounded-md border-gray-300 bg-gray-50"
                                    />

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={stock ?? undefined}
                                        className="w-28 rounded-md border-gray-300"
                                        placeholder="Qty Sold"
                                        value={row.quantity}
                                        onChange={(e) => updateRow(i, 'quantity', Number(e.target.value))}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeRow(i)}
                                        disabled={data.productList.length === 1}
                                        className="rounded-md px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                                    >
                                        Remove
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    {errors.productList && <p className="mt-1 text-sm text-red-600">{errors.productList}</p>}
                </div>

                <div>
                    <h2 className="mb-2 font-medium">Cash Summary</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="mb-1 block text-sm font-medium">Shift</label>
                            <select
                                className="w-full rounded-md border-gray-300"
                                value={data.shift}
                                onChange={(e) => setData('shift', e.target.value)}
                            >
                                <option value="">Select shift…</option>
                                <option value="opening">Opening</option>
                                <option value="closing">Closing</option>
                            </select>
                            {errors.shift && <p className="mt-1 text-sm text-red-600">{errors.shift}</p>}
                        </div>

                        <MoneyField label="Cash on Hand" value={data.cash_amount} onChange={(v) => setData('cash_amount', v)} error={errors.cash_amount} />
                        <MoneyField label="Cash Shortage" value={data.sale_short} onChange={(v) => setData('sale_short', v)} error={errors.sale_short} />
                        <MoneyField label="Gcash" value={data.gcash_amount} onChange={(v) => setData('gcash_amount', v)} error={errors.gcash_amount} />
                        <MoneyField label="Cash Advance" value={data.cash_advance} onChange={(v) => setData('cash_advance', v)} error={errors.cash_advance} />
                        <MoneyField label="Advance Collection" value={data.adv_collection} onChange={(v) => setData('adv_collection', v)} error={errors.adv_collection} />
                        <MoneyField label="Remitted Expenses" value={data.remitted_expenses} onChange={(v) => setData('remitted_expenses', v)} error={errors.remitted_expenses} />

                        <div className="col-span-2">
                            <label className="mb-1 block text-sm font-medium">Total</label>
                            <input
                                type="number"
                                disabled
                                value={total_cash}
                                className="w-full rounded-md border-gray-300 bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                    {processing ? 'Saving…' : 'Save Sale'}
                </button>
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
            <label className="mb-1 block text-sm font-medium">{label}</label>
            <input
                type="number"
                step="0.01"
                className="w-full rounded-md border-gray-300"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}