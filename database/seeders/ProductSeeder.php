<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::factory(3)->create();

        $ingredients = Ingredient::pluck('id');
        $products = Product::pluck('id');

        foreach ($products as $productId) {

            // Shuffle and take 3–7 unique ingredients
            $usedIngredients = $ingredients->shuffle()->take(rand(3, 7));

            $pivotData = [];

            foreach ($usedIngredients as $ingredientId) {
                $pivotData[] = [
                    'product_id' => $productId,
                    'ingredient_id' => $ingredientId,
                    'quantity' => rand(1, 5)
                ];
            }

            // Insert only this product's ingredients
            DB::table('product_ingredients')->insert($pivotData);
        }
    }
}
