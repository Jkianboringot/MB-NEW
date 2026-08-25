<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

          $this->call([
            CategorySeeder::class,
            UnitSeeder::class,

            IngredientSeeder::class,
            BranchSeeder::class,
            // EmployeeSeeder::class,
            UserSeeder::class,
            // ProductSeeder::class,
            ]
        );
    }
}
