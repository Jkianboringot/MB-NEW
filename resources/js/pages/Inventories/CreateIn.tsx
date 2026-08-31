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
}

export default function CreateIn({ branches, products }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        branch_id: number | '';
        inventory_type: string;
        productList: ProductRow[];
    }>({
        branch_id: '',
        inventory_type: 'delivery',
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
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Stock In</h1>

            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Branch</label>
                        <select
                            className="w-full rounded-md border-gray-300"
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
                        {errors.branch_id && <p className="text-red-600 text-sm mt-1">{errors.branch_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                            className="w-full rounded-md border-gray-300"
                            value={data.inventory_type}
                            onChange={(e) => setData('inventory_type', e.target.value)}
                        >
                            <option value="delivery">Delivery</option>
                            <option value="transfer">Branch Transfer</option>
                            <option value="return">Return</option>
                        </select>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-medium">Products Received</h2>
                        <button
                            type="button"
                            onClick={addRow}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            + Add Product
                        </button>
                    </div>

                    <div className="space-y-2">
                        {data.productList.map((row, i) => (
                            <div key={i} className="flex gap-2 items-start">
                                <select
                                    className="flex-1 rounded-md border-gray-300"
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
                                    className="w-32 rounded-md border-gray-300"
                                    placeholder="Qty"
                                    value={row.quantity}
                                    onChange={(e) => updateRow(i, 'quantity', Number(e.target.value))}
                                />

                                <button
                                    type="button"
                                    onClick={() => removeRow(i)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                                    disabled={data.productList.length === 1}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    {errors.productList && <p className="text-red-600 text-sm mt-1">{errors.productList}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
                >
                    {processing ? 'Saving…' : 'Save Stock In'}
                </button>
            </form>
        </div>
    );
}