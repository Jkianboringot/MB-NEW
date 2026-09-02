<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{

    // public function create()
    // {
    //     return Inertia::render('Sales/Create', []);
    // }

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required',
    //         'price' => 'required',
    //     ]);

    //     Sale::create($request->all());
    //     return redirect()->route('sales.index')->with('message', 'Sale Created Successfully');
    // }

    public function delete(Request $request)
    {
        $request->validate([
            'id'=>['required','exists:sales,id']
        ]);

        Sale::findOrFail($request->id)->deleteOrFail();
        return redirect()->route('sales.index')->with('message', 'Sale Delete Successfully');
    }

    public function edit(Request $request)
    {
        $p = Sale::findOrFail($request->id);

        // $request->validate([
        //     'name' => 'required',
        //     'price' => 'required',
        // ]);


        return Inertia::render('Sales/Edit', ['sales' => $p]);

    }

    public function update(Request $request)
    {

        $p = Sale::findOrFail($request->id);

        $request->validate([
            'name' => 'required',
            'price' => 'required',
        ]);


        $p->update($request->all());

        return redirect()->route('sales.index')->with('message', 'Sale Delete Successfully');

    }

    // ASK-YOURSELF - ask about which of this two is better the top update or this below one
    //   public function update(Request $request,Sale $sale)
    // {


    //     $request->validate([
    //         'name' => 'required',
    //         'price' => 'required',
    //     ]);

    //     $sale->update([
    //         'name'=>$sale->input('name'),
    //         'price'=>$sale->input('price'),
    //     ]);

    //     return redirect()->route('sales.index')->with('message', 'Sale Delete Successfully');

    // }
// SaleController.php

    public function index()
    {

        return Inertia::render('Sales/Index', ['sales' => Sale::get()]);
    }
}
