import { storeIn } from '@/routes/inventories';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Branch {
    id: number;
    location: string;
    branch_type: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
}




interface ProductRow {
    product_id: number | '';
    quantity: number;
}

interface Props {
    branches: Branch[];
    products: Product[];
    stockMovementTypes: { value: string; label: string }[];
}

// Shared tokens — reuse these two strings on every field across the app
// so forms stay visually consistent without hand-tuning each one.
const inputClass =
    'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-400';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

export default function CreateIn({ branches, products, stockMovementTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        branch_id: number | '';
        stock_movement_type: string;
        productList: ProductRow[];
    }>({
        branch_id: '',
        stock_movement_type: 'delivery',

        productList: [{ product_id: '', quantity: 1 }],
    });

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

    function submit(e: FormEvent) {
        e.preventDefault();
        post(storeIn().url);
    }

    return (
        <div className="mx-4 max-w-6xl p-6">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Inventory In</h1>
            </div>

            <form onSubmit={submit} className="w-full">
                <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    {/* Details */}
                    <div className="border-b border-gray-100 p-6">
                        <h2 className="mb-4 text-sm font-semibold text-gray-900">Details</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>Branch</label>
                                <select
                                    className={inputClass}
                                    value={data.branch_id}
                                    onChange={(e) => setData('branch_id', Number(e.target.value))}
                                >
                                    <option value="">Select a branch…</option>
                                    {branches.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.location} ({b.branch_type})
                                        </option>
                                    ))}
                                </select>
                                {errors.branch_id && <p className="mt-1.5 text-sm text-red-600">{errors.branch_id}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Stock Type</label>
                                <select
                                    className={inputClass}
                                    value={data.stock_movement_type}
                                    onChange={(e) => setData('stock_movement_type', e.target.value)}
                                >
                                    <option value="">Select stock movement…</option>

                                    {stockMovementTypes.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Products Received</h2>
                            <button
                                type="button"
                                onClick={addRow}
                                className="text-sm font-medium text-orange-600 hover:text-orange-700"
                            >
                                + Add Product
                            </button>
                        </div>

                        <div className="space-y-3">
                            {data.productList.map((row, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50/60 p-3 sm:flex-row sm:items-start"
                                >
                                    <select
                                        className={`${inputClass} flex-1`}
                                        value={row.product_id}
                                        onChange={(e) => updateRow(i, 'product_id', Number(e.target.value))}
                                    >
                                        <option value="">Select product…</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        className={`${inputClass} sm:w-28`}
                                        placeholder="Qty"
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
                            ))}
                        </div>
                        {errors.productList && <p className="mt-2 text-sm text-red-600">{errors.productList}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end border-t border-gray-100 bg-gray-50/60 px-6 py-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving…' : 'Save Stock In'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}