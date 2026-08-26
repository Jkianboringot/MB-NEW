import { Head, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
// import { branch } from '@/routes';

export default function Product() {
    return (
        <>
          <Head title="Product" />
            <div className='m-4'>
                <Link href={'/products/create'}>
                <Button>Create a Product</Button>
                </Link>
            </div>
        </>
    );
}

Product.layout = {
    breadcrumbs: [
        {
            title: 'Product',
            href:'/products'
        },
    ],
};
