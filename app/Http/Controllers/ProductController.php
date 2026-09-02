<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchRequest;
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

    // ASK-YOURSELF - ask about which of this two is better the top update or this below one
    //   public function update(Request $request,Product $product)
    // {


    //     $request->validate([
    //         'name' => 'required',
    //         'price' => 'required',
    //     ]);

    //     $product->update([
    //         'name'=>$product->input('name'),
    //         'price'=>$product->input('price'),
    //     ]);

    //     return redirect()->route('products.index')->with('message', 'PRoduct Delete Successfully');

    // }

    public function index(SearchRequest $request)
    {
        $request->validated();
        $products = Product::query()
            ->when($request->string('search')->trim(), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }
}
