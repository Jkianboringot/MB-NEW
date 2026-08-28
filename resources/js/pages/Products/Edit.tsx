import { Head, Link, router, useForm } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/products';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { CircleAlert } from 'lucide-react';
// import { branch } from '@/routes';
import { update } from '@/routes/products';


interface Product {
    id: number,
    name: string,
    price: number
}

interface Props {
    products: Product
}


//WHY let ai explain we need it to go to teh props why cant we just use product directly, i ask ai but hve not read it yet
export default function Edit({ products }: Props) {

    const { data, setData, put, processing, errors } = useForm({
        name: products.name,
        price: products.price,
    })


    // TODO - fix this its has error on browser console
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('fck')
        put(update(products.id).url);
    }

    return (
        <>
            <Head title="Edit Product" />
            <div className='w-8/12 p-4'>
                <form onSubmit={handleUpdate} className='space-y-4'>
                    {/* display error */}

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <CircleAlert />
                            <AlertTitle>{'product error'}</AlertTitle>
                            <AlertDescription>
                                <ul className="list-inside list-disc text-sm">
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className='gap-1.5'>
                        <Label htmlFor='product name'>Name</Label>
                        <Input placeholder='Product name' value={data.name} onChange={(e) => setData('name', e.target.value)}></Input>
                    </div>

                    <div className='gap-1.5'>
                        <Label htmlFor='product price'>Price</Label>
                        <Input placeholder='Price' value={data.price} onChange={(e) => setData('price', e.target.value)}></Input>
                    </div>

                    {/* <div className='gap-1.5'>
                        <Label htmlFor='product description'>Description</Label>
                        <Textarea placeholder='Description' onChange={(e) => setData('description', e.target.value)}></Textarea>
                    </div> */}

                    <Button type='submit'>Udpate</Button>
                </form>
            </div>
        </>
    );
}


Edit.layout = {
    breadcrumbs: [
        {
            title: 'Edit Product',
            // href: `/products/${products.id}/edit`

        },
    ],
};
