import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert, Megaphone } from 'lucide-react';
// import { branch } from '@/routes';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


interface PageProps {
    flash: {
        message?: string
    },
    products: Product[]
}



interface Product {
    id: number,
    name: string,
    price: number,

}


export default function Product() {
    const { flash, products } = usePage().props as PageProps;
    console.log(products)

    // const  handleDelete = useCallback((id:number,name:string) => {
    //   setList(prev => prev.filter(item => item.id != id))
    // }, []);

    const { processing, delete: destroy, put: put } = useForm()

    const handleDelete = (id: number, name: string) => {
        if (confirm(`do you want to fuck- ${id}. ${name}`)) {
            destroy(route('products.delete', id)) //WHY - appreantly this is better than the one below, because route name can change
            //but by doing it in route we are only calling name so route can hcange but route name cannot

            // TEST do we have to create a test for this destroy like the test would consist of if i change the route will this destroy still
            // be able to access the uri or do its suppose operation

            // destroy(`/products/${id}`)
        }
    };



    return (
        <>
            <div className='m-4'>
                <div>
                    {flash.message && (
                        <Alert variant="destructive">
                            <Megaphone />
                            <AlertTitle>{'NOTIFICATION'}</AlertTitle>
                            <AlertDescription>
                                <ul className="list-inside list-disc text-sm">
                                    {Object.entries(flash).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            <Head title="Product" />
            <div className='m-4'>
                <Link href={'/products/create'}>
                    <Button>Create a Product</Button>
                </Link>
            </div>
            {products.length > 0 && (
                <div>
                    <Table>
                        <TableHeader>
                            {/* <TableHead isRowHeader className="w-[100px]">Invoice</TableHead> */}


                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Action</TableHead>

                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell >{product.price}</TableCell>
                                    <TableCell >{product.price}</TableCell>
                                    <TableCell className='text-center space-x-2'>
                                        <Link href={`/products/${product.id}/edit`}>
                                            <Button className='bg-slate-600 hover:bg-slate-700'>Edit</Button>
                                        </Link>
                                        <Button disabled={processing} onClick={() => handleDelete(product.id, product.name)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </div>
            )}
        </>
    );
}

Product.layout = {
    breadcrumbs: [
        {
            title: 'Product',
            href: '/products'
        },
    ],
};
