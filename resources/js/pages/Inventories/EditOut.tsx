import { useForm } from '@inertiajs/react';
import { FormEvent, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { updateOut } from '@/routes/inventories';

interface Product {
    id: number;
    name: string;
    quantity: number;
}

interface Branch {
    id: number;
location: string|null;
    products: Product[];
}

interface ProductRow {
    product_id: number | '';
    quantity: number;
}

interface SelectOption {
    value: string;
    label: string;
}

interface InventoryOut {
    id: number;
    branch_id: number;
    stock_movement_type: string|null;
    productList: ProductRow[];
    shift: string;
    cash_amount: number;
    cash_shortage: number|null;
    gcash_amount: number|null;
    cash_advance: number|null;
    remitted_expenses: number|null;
}

interface Props {
    inventory: InventoryOut;
    branches: Branch[];
    stockMovementTypes: SelectOption[];
    shifts: SelectOption[];
}

export default function EditOut({ inventory, branches, stockMovementTypes, shifts }: Props) {
    // HACK - same as CreateOut: shift / stock_movement_type should be enum-typed once
    // the backend returns something we can check directly against an enum.
    const { data, setData, put, processing, errors } = useForm<{
        branch_id: number | '';
        productList: ProductRow[];
        shift: string;
        stock_movement_type: string|null;
        cash_amount: number;
        cash_shortage: number|null;
        gcash_amount: number|null;
        cash_advance: number|null;
        remitted_expenses: number|null;
        net_cash: number;
    }>({
        branch_id: inventory.branch_id,
        // fall back to one empty row if, for some reason, the record has no items
        productList: inventory.productList.length > 0 ? inventory.productList : [{ product_id: '', quantity: 1 }],
        shift: inventory.shift,
        stock_movement_type: inventory.stock_movement_type,
        cash_amount: inventory.cash_amount,
        cash_shortage: inventory.cash_shortage,
        gcash_amount: inventory.gcash_amount,
        cash_advance: inventory.cash_advance,
        remitted_expenses: inventory.remitted_expenses,
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
            Number(data.cash_shortage)
        );
    }, [data.cash_amount, data.gcash_amount, data.cash_advance, data.remitted_expenses, data.cash_shortage]);

    // NOTE - unlike CreateOut, we do NOT reset productList when branch changes here.
    // Switching branch on an edit is an edge case (it implies moving the whole sale
    // to a different branch's stock) — if you want CreateOut's reset-on-change
    // behavior here too, uncomment the productList reset below.
    function handleBranchChange(branchId: number) {
        setData((prev) => ({
            ...prev,
            branch_id: branchId,
            // productList: [{ product_id: '', quantity: 1 }],
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

    function pickedElsewhere(index: number): number[] {
        return data.productList
            .filter((_, i) => i !== index)
            .map((r) => r.product_id)
            .filter((id): id is number => id !== '');
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        setData('net_cash', total_cash);
        put(updateOut(inventory.id).url, {
            data: {
                ...data,
            },
        });
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-ink">Edit Inventory Out</h1>
            </div>

            <form onSubmit={submit} className="w-full">
                <div className="w-full overflow-hidden rounded-xl border border-[#f0ddc8] bg-[#fdf8f2]">
                    {/* Branch */}
                    <div className="border-b border-[#f0ddc8] p-6">
                        <h2 className="mb-4 text-sm font-semibold text-ink">Branch</h2>
                        <Select
                            value={data.branch_id ? String(data.branch_id) : undefined}
                            onValueChange={(value) => handleBranchChange(Number(value))}
                        >
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select a branch…" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((b) => (
                                    <SelectItem key={b.id} value={String(b.id)}>
                                        {b.location}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.branch_id && <p className="mt-1.5 text-sm text-danger">{errors.branch_id}</p>}
                    </div>

                    {/* Products sold */}
                    <div className="border-b border-[#f0ddc8] p-6">
                        <div className="mb-1 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-ink">Products Sold</h2>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={addRow}
                                disabled={!selectedBranch}
                                className="text-brand-orange hover:text-brand-orange-hover disabled:opacity-40"
                            >
                                <Plus className="h-4 w-4" />
                                Add Product
                            </Button>
                        </div>
                        <p className="mb-4 text-xs text-subtle">
                            Editing recalculates stock against this record's original quantities — the branch
                            totals shown below already reflect this record's current effect.
                        </p>

                        <div className="space-y-3">
                            {data.productList.map((row, i) => {
                                const excluded = pickedElsewhere(i);
                                const stock = stockFor(row.product_id);

                                return (
                                    <div
                                        key={i}
                                        className="flex flex-col gap-3 rounded-lg border border-[#f0ddc8] bg-white/60 p-3 sm:flex-row sm:items-start"
                                    >
                                        <Select
                                            value={row.product_id ? String(row.product_id) : undefined}
                                            disabled={!selectedBranch}
                                            onValueChange={(value) => updateRow(i, 'product_id', Number(value))}
                                        >
                                            <SelectTrigger className="flex-1 bg-white">
                                                <SelectValue
                                                    placeholder={selectedBranch ? 'Select product…' : 'Select a branch first…'}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {selectedBranch?.products
                                                    .filter((p) => !excluded.includes(p.id))
                                                    .map((p) => (
                                                        <SelectItem key={p.id} value={String(p.id)}>
                                                            {p.name} ({p.quantity} in stock)
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            type="number"
                                            disabled
                                            value={stock ?? ''}
                                            placeholder="In stock"
                                            className="bg-white sm:w-28"
                                        />

                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            className="bg-white sm:w-28"
                                            placeholder="Qty sold"
                                            value={row.quantity}
                                            onChange={(e) => updateRow(i, 'quantity', Number(e.target.value))}
                                        />

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeRow(i)}
                                            disabled={data.productList.length === 1}
                                            className="shrink-0 text-danger hover:bg-danger/10 hover:text-danger disabled:opacity-40"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                        {errors.productList && <p className="mt-2 text-sm text-danger">{errors.productList}</p>}
                    </div>

                    {/* Cash summary */}
                    <div className="p-6">
                        <h2 className="mb-4 text-sm font-semibold text-ink">Cash Summary</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="shift">Shift</Label>
                                <Select value={data.shift || undefined} onValueChange={(value) => setData('shift', value)}>
                                    <SelectTrigger id="shift" className="mt-1.5 w-full bg-white sm:max-w-xs">
                                        <SelectValue placeholder="Select shift…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shifts.map((v) => (
                                            <SelectItem key={v.value} value={v.value}>
                                                {v.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.shift && <p className="mt-1.5 text-sm text-danger">{errors.shift}</p>}
                            </div>

                            <div>
                                <Label htmlFor="stock_movement_type">Stock Type</Label>
                                <Select
                                    value={data.stock_movement_type || undefined}
                                    onValueChange={(value) => setData('stock_movement_type', value)}
                                >
                                    <SelectTrigger id="stock_movement_type" className="mt-1.5 w-full bg-white sm:max-w-xs">
                                        <SelectValue placeholder="Select stock movement…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stockMovementTypes.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.stock_movement_type && (
                                    <p className="mt-1.5 text-sm text-danger">{errors.stock_movement_type}</p>
                                )}
                            </div>

                            <MoneyField label="Cash on Hand" value={data.cash_amount} onChange={(v) => setData('cash_amount', v)} error={errors.cash_amount} />
                            <MoneyField label="Cash Shortage" value={data.cash_shortage} onChange={(v) => setData('cash_shortage', v)} error={errors.cash_shortage} />
                            <MoneyField label="Gcash" value={data.gcash_amount} onChange={(v) => setData('gcash_amount', v)} error={errors.gcash_amount} />
                            <MoneyField label="Cash Advance" value={data.cash_advance} onChange={(v) => setData('cash_advance', v)} error={errors.cash_advance} />
                            <MoneyField label="Remitted Expenses" value={data.remitted_expenses} onChange={(v) => setData('remitted_expenses', v)} error={errors.remitted_expenses} />
                        </div>

                        <div className="mt-4 flex items-center justify-between rounded-lg border border-[#f0ddc8] bg-white/60 px-4 py-3">
                            <span className="text-sm font-medium text-ink">Total</span>
                            <span className="text-base font-semibold text-ink">₱{total_cash.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end border-t border-[#f0ddc8] bg-white/60 px-6 py-4">
                        <Button type="submit" disabled={processing} className="bg-green-600 font-bold text-white hover:bg-green-700">
                            {processing ? 'Saving…' : 'Update Sale'}
                        </Button>
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
            <Label>{label}</Label>
            <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-subtle">₱</span>
                <Input type="number" step="0.01" className="bg-white pl-7" value={value} onChange={(e) => onChange(Number(e.target.value))} />
            </div>
            {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
        </div>
    );
}