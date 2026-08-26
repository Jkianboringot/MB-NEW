import { Head, Link, router, useForm } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/products';
// import { branch } from '@/routes';

export default function Product() {

    const {data,setData,post,processing,errors}=useForm({
        name:'',
        price:'',
        description:'',
    })

    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault() //this prevent reloads of whole page
        console.log(e)
        post(store().url); // this must match the route name 'products.store' exactly
    }

    return (
        <>
          <Head title="Create New Product" />
            <div className='w-8/12 p-4'>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='gap-1.5'>
                    <Label htmlFor='product name'>Name</Label>
                    <Input placeholder='Product name' value={data.name} onChange={(e)=>setData('name',e.target.value)}></Input>
                </div>

                  <div className='gap-1.5'>
                    <Label htmlFor='product price'>Price</Label>
                    <Input placeholder='Price' onChange={(e)=>setData('price',e.target.value)}></Input>
                </div>

                 <div className='gap-1.5'>
                    <Label htmlFor='product description'>Description</Label>
                    <Textarea placeholder='Description' onChange={(e)=>setData('description',e.target.value)}></Textarea>
                </div>

                <Button type='submit'>Save</Button>
              </form>
            </div>
        </>
    );
}

Product.layout = {
    breadcrumbs: [
        {
            title: 'Create New Product',
            href:'/products/create'
        },
    ],
};
