import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';
import { store } from '@/routes/products';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        cost: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url);
    };

    return (
        <>
            <Head title="Create New Product" />

            <div className="mx-auto w-full  max-w-4xl p-6">
                <div className="mb-4">
                    <h1 className=" text-2xl font-bold text-ink">New Product</h1>
                    <p className="mt-0.5 text-sm text-subtle">
                        Add a product to your catalog.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-xl border border-[#f0ddc8] bg-white p-5"
                >
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <CircleAlert />
                            <AlertTitle>Something's not right</AlertTitle>
                            <AlertDescription>
                                <ul className="list-inside list-disc text-sm">
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-1">
                        <Label htmlFor="name" className="font-semibold text-ink">
                            Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Product name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="border-[#e0d0c0]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="price" className="font-semibold text-ink">
                                Price
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="border-[#e0d0c0]"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="cost" className="font-semibold text-ink">
                                Cost
                            </Label>
                            <Input
                                id="cost"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={data.cost}
                                onChange={(e) => setData('cost', e.target.value)}
                                className="border-[#e0d0c0]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-[#f0ddc8] pt-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-brand-orange font-bold text-white hover:bg-brand-orange-hover disabled:opacity-60"
                        >
                            Save Product
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Create New Product',
            href: '/products/create',
        },
    ],
};