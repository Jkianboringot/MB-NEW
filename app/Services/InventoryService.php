<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;


class InventoryService
{
    // this needs to do create for sale,payroll, and add_ingredeint✅

    // let focus on just making inventory

    // step:
    // 1. Inventory($data) will recieve data as already validated
    // 2. it save data and sync but it must go to check first
    // -data is just save in here but the validation happen before, check
    // is possible if it is busines logic like below
    // check: it must check first if branch and ingredient alrady exist in pivot table

    public function Inventory(array $data, $productList)
    {
        // $data=['branch_id'=>1,'ingredient_id'=>1,'quantity'=>10]

        // try {

        //     DB::transaction(
        //         function () {
        //             $inv = new Inventory;
        //             $inv->fill($this->data);

        //             // we need for each because we will have collection of product
        //             // and we just update the quantity, but we still need to do the check
        //             // -also we need to re think the storing of pivot table id to inventory, like
        //             // is that really possible, think do we cerate the so called pivot first or later,
        //             // becuase if first then it is possible to store it in iventory if not we cant store
        //             // pivot id to inventory, becuase it needs to exist first,my plan is full of holes and
        //             // am suppose to watch all vid in tablet lets do that no more load fuck it, just connnect ot other`s
        //             foreach ($this->productList as $listItem) {

        //                 $this->addProduct->products()->syncWithoutDetaching([
        //                     $listItem['product_id'] => [
        //                         'quantity' => $listItem['quantity'],
        //                     ],
        //                 ]);

        //                 $this->logs($listItem);
        //             }
        //             $inv->stock_movement->syncn([$inv]);
        //             // REMOVE - implement what i did below but do it with eloquent
        //             //     $exist = DB::table('add_ingredients')
        //             //         ->where('branch_id', $data->branch_id)
        //             //         ->where('ingredient_id', $data->ingredient_id)
        //             //         ->first();

        //             //     if (!$exist) {
        //             //         DB::table('add_ingredients')->insert($data);
        //             //     }
        //             // else{
        //             //         DB::table('add_ingredients')
        //             //          ->where('branch_id', $data->branch_id)
        //             //         ->where('ingredient_id', $data->ingredient_id)
        //             //         ->update(['quantity'=>$data->quantity]);
        //             // }
        //         }
        //     );

        // } catch (\Throwable $th) {
        //     throw $th; // fix this later, make it proper
        // }

    }

    // sale the sale
    public function Sale(array $data)
    {

        // try {

        //     DB::transaction(
        //         function () {

        //             // we need the id of inventory for this, but the only way to do that is to let inventroy finsih first
        //             // then give it to sale ,but thier a problem because the way we wil do this is latest inventory
        //             // unless we create the pk ourself,or get it and do plus one on it as process in backend so we predict it
        //             // but it si still wrong becuase of race condition,example what if mb1 and mb2 both create a sale and mb2 was the last one
        //             // but the sale came from mb1, but it was inputed in sale that itwas mb2 that create it, then it will store
        //             // mb2 because it is latest, so either we dont store it or create another table that wil hold it,

        //             $sale = new Sale;
        //             $sale->fill($this->data);

        //         }
        //     );

        // } catch (\Throwable $th) {
        //     throw $th; // fix this later, make it proper
        // }
    }

    // add to the payroll
    public function payroll(array $data)
    {

        //   new PayrollService::create($this->data);
    }
}

// finish this today so that we can move on to to pern which should be easier, learn isolation for it

// figure out how you will send data here first and fins the fucing pivot pk
