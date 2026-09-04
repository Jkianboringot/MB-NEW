<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductController extends Controller
{

    public function create()
    {
        return Inertia::render('Products/Create', []);
    }

    public function store(ProductRequest $request,Product $product)
    {
        $product->create($request->validated());
        return redirect()->route('products.index')->with('message', 'Product Created Successfully');
    }

    public function delete(Product $product)
    {
        try {
            $product->deleteOrFail();
        } catch (\Throwable $th) {
            Log::error($th);
            return back()->with('error', 'Cannot delete this product — it still has associated inventory or sales records.');
        }

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }


    public function edit(Product $product)
    {
        // $p = Product::findOrFail($request->id);

        // $request->validate([
        //     'name' => 'required',
        //     'price' => 'required',
        // ]);


        return Inertia::render('Products/Edit', ['products' => $product]);

    }

    public function update(ProductRequest $request, Product $product)
    {

        // i have this thing so i dont have to do validation exists on id, and i do this first
        //becuase if it finds something validate it if not dont even bother validating anything
        // $p = Product::findOrFail($request->id);


        $product->update($request->validated());

        return redirect()->route('products.index')->with('message', 'Product Update Successfully');

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
                $query->where('name', 'like', "{$search}%");
            })
            ->orderBy('created_at', 'desc')

            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }
}
