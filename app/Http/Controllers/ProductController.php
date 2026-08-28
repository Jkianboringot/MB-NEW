<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{

    public function create()
    {
        return Inertia::render('Products/Create', []);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'price' => 'required',
        ]);

        Product::create($request->all());
        return redirect()->route('products.index')->with('message', 'PRoduct Created Successfully');
    }

    public function delete(Request $request)
    {


        Product::findOrFail($request->id)->deleteOrFail();
        return redirect()->route('products.index')->with('message', 'PRoduct Delete Successfully');
    }

    public function edit(Request $request)
    {
        $p = Product::findOrFail($request->id);

        // $request->validate([
        //     'name' => 'required',
        //     'price' => 'required',
        // ]);


        return Inertia::render('Products/Edit', ['products' => $p]);

    }

    public function update(Request $request)
    {

        $p = Product::findOrFail($request->id);

        $request->validate([
            'name' => 'required',
            'price' => 'required',
        ]);


        $p->update($request->all());

        return redirect()->route('products.index')->with('message', 'PRoduct Delete Successfully');

    }

    public function index()
    {

        return Inertia::render('Products/Index', ['products' => Product::get()]);
    }
}
