<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Ingredient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ingredient>
 */
class IngredientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->words(2, true),
            'threshold' => $this->faker->numberBetween(5, 25),
            'category_id' => Category::inRandomOrder()->value('id'),
        ];
    }
}
